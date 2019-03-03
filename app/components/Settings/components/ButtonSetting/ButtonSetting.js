import React from 'react';
import { Button, Divider, Icon } from 'antd';
import styles from './ButtonSetting.scss';

const ButtonSetting = (props) => {
  return (
    <div>
      <div className={styles.container}>
        <div>
          <div className={styles.mainText}>{props.mainText} <Icon type={props.icon || "robot"} theme="filled" /></div>
          <div className={styles.description}>{props.description}</div>
        </div>
        <div className={styles.action}>
          <Button type="primary" disabled={props.disabled || false} loading={props.loading || false} onClick={props.onClick || null}>{props.btnText}</Button>
        </div>
      </div>
      <Divider />
    </div>

  );
};

export default ButtonSetting;