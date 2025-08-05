#include "jsrt_sciter_value.h"
#include <limits>
#include <cmath>

using namespace v8;

namespace jsrt_sciter
{
sciter::value jsToSciterValue(Isolate* isolate, const Local<Value>& val)
{
  if (val->IsUndefined())
  {
    return sciter::value();
  }
  else if (val->IsNull())
  {
    return sciter::value::null();
  }
  else if (val->IsBoolean())
  {
    return sciter::value(Boolean::Cast(*val)->Value());
  }
  else if (val->IsNumber())
  {
    auto v = Number::Cast(*val)->Value();
    double vi;
    if (std::modf(v, &vi) == 0 &&
        (v > -std::numeric_limits<int32_t>::max() &&
         v < std::numeric_limits<int32_t>::max()))
    {
      return sciter::value(int(v));
    }
    return sciter::value(v);
  }
  else if (val->IsString())
  {
    return sciter::value(std::string(*v8::String::Utf8Value(isolate, val)));
  }
  else if (val->IsObject())
  {
    if (val->IsArray())
    {
      auto ctx = isolate->GetCurrentContext();
      auto mayBeObj = val->ToObject(ctx);
      Local<Object> localObj;
      if (mayBeObj.ToLocal(&localObj))
      {
        auto v8_arr = Array::Cast(*val);
        sciter::value arr = sciter::value::make_array(v8_arr->Length());
        for (uint32_t i = 0; i < v8_arr->Length(); ++i)
        {
          auto mayBeItem = localObj->Get(ctx, i);
          Local<Value> item;
          if (mayBeItem.ToLocal(&item))
          {
            arr.set_item(int(i), jsToSciterValue(isolate, item));
          }
        }
        return arr;
      }
    }
    else
    {
      auto ctx = isolate->GetCurrentContext();
      sciter::value map = sciter::value::make_map();
      auto mayBeObj = val->ToObject(ctx);
      Local<Object> localObj;
      if (mayBeObj.ToLocal(&localObj))
      {
        auto mayBePropertyNames = localObj->GetPropertyNames(ctx);
        //assert(mayBePropertyNames.IsArray());
        Local<Array> propertyNamesArr;
        if (mayBePropertyNames.ToLocal(&propertyNamesArr))
        {
          for (uint32_t i = 0; i < propertyNamesArr->Length(); ++i)
          {
            auto mayBeKey = propertyNamesArr->Get(ctx, i);
            Local<Value> key;
            if (mayBeKey.ToLocal(&key))
            {
              Maybe<bool> mayBeHasOwnProperty = localObj->HasOwnProperty(ctx, key.As<String>());
              if (!mayBeHasOwnProperty.FromMaybe(false)) continue;
              auto mayBeItem = localObj->Get(ctx, key);
              Local<Value> item;
              if (mayBeItem.ToLocal(&item))
              {
                map.set_item(jsToSciterValue(isolate, key),
                             jsToSciterValue(isolate, item));
              }
            }
          }
        }
      }
      return map;
    }

  }
  //napi_function,
  //napi_external,
  //napi_bigint,
  return sciter::value();
}

std::vector<sciter::value> jsToSciterValues(const FunctionCallbackInfo<Value>& args, uint8_t startIndex)
{
  std::vector<sciter::value> sciterValues(args.Length() - startIndex);
  uint8_t index = 0;
  for (auto i = startIndex; i < args.Length(); ++i)
  {
    sciterValues[index++] = jsToSciterValue(args.GetIsolate(), args[i]);
  }
  return sciterValues;
}

Local<Value> sciterToJsValue(Isolate* isolate, sciter::value val)
{
  val.isolate(); // force it to be converted to primitive close-to-JSON constructs
  //napi_value result = nullptr;
  switch (val.t)
  {
    case T_UNDEFINED:   return Undefined(isolate);
    case T_NULL:        return Null(isolate);
    case T_BOOL:        return val.get<bool>() ? True(isolate) : False(isolate);
    case T_COLOR:
    case T_INT:         return Integer::New(isolate, val.get<int>());
    case T_DURATION:
    case T_ANGLE:
    case T_FLOAT:       return Integer::New(isolate, val.get<double>());
    case T_STRING:
      {
        sciter::string s = val.to_string();
        auto myBeStr = String::NewFromTwoByte(isolate,
          reinterpret_cast<const uint16_t*>((const char16_t*)s.c_str()),
          NewStringType::kNormal, s.size());
        Local<String> localStr;
        if (myBeStr.ToLocal(&localStr))
        {
          return localStr;
        }
        return Undefined(isolate);
      }
    case T_ARRAY:
      {
        auto ctx = isolate->GetCurrentContext();
        size_t n = val.length();
        auto arr = Array::New(isolate, n);
        for (uint32_t i = 0; i < n; ++i)
        {
          arr->Set(ctx, i, sciterToJsValue(isolate, val.get_item(int(i))));
        }
        return arr;
      }
    case T_MAP:
      {
        auto ctx = isolate->GetCurrentContext();
        auto obj = Object::New(isolate);
        val.each_key_value([&](const sciter::value& key, const sciter::value& val) -> bool
        {
          obj->Set(ctx, sciterToJsValue(isolate, key), sciterToJsValue(isolate, val));
          return true;
        });
        return obj;
      }
  /*
      T_DATE = 6,     // INT64 - contains a 64-bit value representing the number of 100-nanosecond intervals since January 1, 1601 (UTC), a.k.a. FILETIME on Windows
      T_CURRENCY = 7, // INT64 - 14.4 fixed number. E.g. dollars = int64 / 10000;
      T_LENGTH = 8,   // length units, value is int or float, units are VALUE_UNIT_TYPE
      T_MAP = 10,
      T_FUNCTION = 11,   // named tuple , like array but with name tag
      T_BYTES = 12,      // sequence of bytes - e.g. image data
      T_OBJECT = 13,     // scripting object proxy (TISCRIPT/SCITER)
      T_DOM_OBJECT = 14,  // DOM object, use get_object_data to get HELEMENT
                          //T_RESOURCE = 15,  // 15 - other thing derived from tool::resource
                          //T_RANGE = 16,     // 16 - N..M, integer range.
  */

  }
  return Undefined(isolate);
}

std::vector<Local<Value>> sciterToJsValues(Isolate* isolate, aux::slice<sciter::value> values, uint8_t startIndex)
{
  std::vector<Local<Value>> jsValues(values.length - startIndex);
  uint8_t index = 0;
  for (auto i = startIndex; i < values.length; ++i)
  {
    jsValues[index++] = sciterToJsValue(isolate, values[i]);
  }
  return jsValues;
}
} // jsrt_sciter namespace