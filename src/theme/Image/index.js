import React from 'react';
import classnames from 'classnames';

import styles from './styles.module.scss';

function Image(props) {
  let {src: source, loading} = props;
  if (!source.match(/^((http|https):\/\/|\/)/) && typeof window !== 'undefined') {
    // Calculate relative url based on current route.
    const basePath = window.location.pathname.replace(/index\.[a-z]+$/, '')
      .split('/').filter(Boolean).slice(0,-1).join('/');
    source = `/${basePath}/${source}`.replace(/\/{2,}/, '/');
  }

  const imageProps = {
    ...props,
    src: source,
    loading: loading || "lazy",
    center: undefined,
    borderless: undefined
  };

  return (
    <img {...imageProps} className={classnames(styles.Image, {
        [styles.ImageCenter]: props.center,
        [styles.ImageBorderless]: props.borderless
      })}
    />
  );
}

export default Image;
