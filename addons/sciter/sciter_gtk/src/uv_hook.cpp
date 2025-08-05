#include <gtk/gtk.h>
#include <uv.h>

#include <functional>

typedef struct _MySource MySource;

struct _MySource
{
  GSource base;
  gpointer tag;
  std::function<bool()> iterate_uv;
};

gboolean prepare(GSource *source, gint *timeout)
{
  uv_update_time(uv_default_loop());
  *timeout = uv_backend_timeout(uv_default_loop());
  return 0 == *timeout;
}

gboolean check(GSource *source)
{
  if (!uv_backend_timeout(uv_default_loop()))
  {
    return TRUE;
  }

  MySource* mySource = reinterpret_cast<MySource*>(source);

  return G_IO_IN == g_source_query_unix_fd(source, mySource->tag);
}

gboolean dispatch(GSource *source, GSourceFunc callback, gpointer user_data)
{
  MySource* mySource = reinterpret_cast<MySource*>(source);

  mySource->iterate_uv();

  return G_SOURCE_CONTINUE; // TRUE
}

GSourceFuncs source_funcs = {
  .prepare = prepare,
  .check = check,
  .dispatch = dispatch,
  .finalize = nullptr
};

void hook_uv(std::function<bool()> iterate_uv_cbk)
{
  uv_loop_t* loop = uv_default_loop();

  GSource *source = g_source_new(&source_funcs, sizeof(MySource));

  ((MySource*)source)->tag = g_source_add_unix_fd(source, uv_backend_fd(loop), G_IO_IN);
  ((MySource*)source)->iterate_uv = iterate_uv_cbk;

  g_source_attach(source, nullptr);
}