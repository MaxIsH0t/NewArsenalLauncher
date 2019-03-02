import React, { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Button, Icon, Tooltip, Input } from 'antd';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { connect } from 'react-redux';
import CopyIcon from '../../../Common/CopyIcon/CopyIcon';
import styles from './JavaManager.scss';
import SettingCard from '../SettingCard/SettingCard';
import Title from '../Title/Title';
import { findJavaHome } from '../../../../utils/javaHelpers';
import store from '../../../../localStore';
import SwitchSetting from '../SwitchSetting/SwitchSetting';
import SettingInput from '../SettingInput/SettingInput';
import JavaMemorySlider from './javaMemorySlider';
import * as SettingsActions from '../../../../actions/settings';

function JavaManager(props) {
  const [is64bit, setIs64bit] = useState(true);
  const [javaPath, setJavaPath] = useState('');

  const checkJavaArch = async () => {
    const javaP = await findJavaHome();
    setJavaPath(javaP);
    exec(`"${javaP}" -d64 -version`, (err, stdout, stderr) => {
      if (stderr.includes('Error') || stdout.includes('Error'))
        setIs64bit(false);
    });
  };

  useEffect(() => {
    checkJavaArch();
  }, []);

  const openFolderDialog = () => {
    const { dialog } = require('electron').remote;
    dialog.showOpenDialog(
      {
        properties: ['openFile'],
        defaultPath: path.dirname(javaPath)
      },
      paths => {
        props.setJavaPath(false, paths[0]);
      }
    );
  };

  return (
    <div>
      <Title>Java Manager (Global)</Title>
      <SwitchSetting
        mainText="Autodetect Java Path"
        description="If enabled, java path will be autodetected"
        icon="folder"
        checked={props.settings.java.autodetected}
        onChange={async c =>
          props.setJavaPath(c, c ? null : await findJavaHome())
        }
      />
      {props.settings.java.autodetected ? null : (
        <div>
          <span style={{ fontSize: 18 }}>Java Custom Path</span>
          <Input
            size="large"
            style={{
              width: '90%',
              display: 'inline-block',
              height: '60px',
              marginBottom: 10,
              marginTop: 4
            }}
            prefix={
              <Icon
                type="folder"
                theme="filled"
                style={{ color: 'rgba(255,255,255,.8)' }}
              />
            }
            placeholder="(If empty, the game won't start)"
            onChange={e => props.setJavaPath(false, e.target.value)}
            value={props.settings.java.path}
          />
          <Button
            type="primary"
            icon="folder"
            theme="filled"
            onClick={() => openFolderDialog()}
            style={{ height: 60, marginLeft: 10 }}
          />
        </div>
      )}
      <JavaMemorySlider
        ram={props.settings.java.memory}
        is64bit={is64bit}
        updateMemory={props.setJavaMemory}
      />
    </div>
  );
}

function mapStateToProps(state) {
  return {
    username: state.auth.displayName,
    email: state.auth.email,
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JavaManager);
