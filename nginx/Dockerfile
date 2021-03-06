FROM ubuntu:latest as buildstep
RUN echo "intalling nginx with mod-pagespeed" && \
  apt-get update && \
  apt-get install -y curl build-essential zlib1g-dev libpcre3-dev unzip wget uuid-dev sudo openssl libssl-dev && \
  curl -kfL -sS https://ngxpagespeed.com/install > install.sh && \
  bash install.sh --nginx-version latest --additional-nginx-configure-arguments '--with-http_ssl_module'

FROM scratch as configstep
COPY --from=nginx:mainline /etc/nginx /etc/nginx
COPY nginx.conf perf.conf pagespeed.conf /etc/nginx/
COPY channel.conf.tmpl /etc/nginx/conf.d/
COPY entrypoint.sh /
COPY 50x.html /usr/share/nginx/html/

FROM ubuntu:latest
RUN apt-get update && \
  apt-get install -y gettext-base libssl1.1 && \
  apt-get -y autoremove && \
  apt-get clean && \
  rm -r /var/cache/apt /var/lib/apt/lists
COPY --from=buildstep /usr/local/nginx /usr/local/nginx
COPY --from=configstep / /
ENV NPSC_ENABLE_FILTERS=in_place_optimize_for_browser,prioritize_critical_css,inline_preview_images,lazyload_images,rewrite_images,rewrite_css,remove_comments,local_storage_cache,move_css_to_head,move_css_above_scripts,collapse_whitespace,combine_javascript,extend_cache NPSC_JsPreserveURLs=off NPSC_ImagePreserveURLs=on NPSC_ForceCaching=off

EXPOSE 80 443

ENTRYPOINT [ "sh", "entrypoint.sh" ]
