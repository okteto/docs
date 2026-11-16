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
    borderless: undefined,
    mobileSrc: undefined
  };

  const image = (
    <img {...imageProps} className={classnames(styles.Image, {
        [styles.ImageCenter]: props.center,
        [styles.ImageBorderless]: props.borderless
      })}
    />
  );

  // mobileSrc: an alternative image (for example, a diagram stacked
  // vertically) served on narrow screens instead of src.
  if (!props.mobileSrc) {
    return image;
  }
  return (
    <picture>
      <source media="(max-width: 600px)" srcSet={props.mobileSrc} />
      {image}
    </picture>
  );
}

export default Image;
