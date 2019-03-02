// @flow
import React, { Component } from 'react';
import { Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { PACKS_PATH, THEMES } from '../../constants';
import styles from './Home.scss';
import News from './components/News/News';
import Card from '../Common/Card/Card';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;
  constructor(props) {
    super(props);
    this.state = {
      latestBtnClicked: false,
      latestInstalled: false
    };
  }
  /* eslint-disable */
  openLink(url) {
    require('electron').shell.openExternal(url);
  }

  componentDidMount = async () => {
    this.props.getNews();
    try {
      await promisify(fs.access)(path.join(PACKS_PATH, '1.13.2'));
      this.setState({ latestInstalled: true });
    } catch (e) {
      this.setState({ latestInstalled: false });
    }
    // Downloads the versions list just the first time
    if (this.props.versionsManifest.length === 0) {
      this.props.getVanillaMCVersions();
    }
  };

  /* eslint-enable */

  render() {
    return (
      <div>
        <main className={styles.content}>
          <div className={styles.innerContent}>
            <News news={this.props.news} />
            <div className={styles.cards}>
              <Card
                style={{
                  height: 'auto',
                  width: '100%',
                  minWidth: 420,
                  display: 'block',
                  marginTop: 15,
                  textAlign: 'center'
                }}
                title={`Welcome ${this.props.username} to Arsenal Launcher`}
              >
                <div className={styles.firstCard}>
                  <div>
                    <span className={styles.titleHeader}>
                      Support Arsenal Network on the{' '}
                      <a
                        href="https://store.arsenalnetwork.net/"
                        className={styles.patreonText}
                      >
                        Online Shop
                      </a>
                    </span>
                    <div className={styles.patreonContent}>
                      If you like Arsenal Launcher and you would like it to have even
                      more features and bug fixes, consider helping us out
                      supporting the project. Happy Gaming!

                     <br /><br />Current Packs On Arsenal: (Seach them on modpacks tab)
                      <br />- Wizardz Conquest 5
                      <br />- WC Tech & Magic
                      <br />- Tekxit 2
                      <br />- Pixelmon
                    </div>
                  </div>
                  <div>
                    You can find us here:
                    <div className={styles.discord}>
                      <a href="https://discord.gg/8vF9PYM">Discord</a>
                    </div>
                    <div className={styles.github}>
                      <a href="https://arsenalnetwork.net/">Website</a>
                    </div>
                    <div className={styles.instagram}>
                      <a href="https://arsenalnetwork.net/community/index.php">Forums</a>
                    </div>
                    <div className={styles.facebook}>
                      <a href="https://store.arsenalnetwork.net/">Store</a>
                    </div>
                  </div>
                </div>
              </Card>
              <Card
                style={{
                  height: 170,
                  width: '100%',
                  minWidth: 420,
                  display: 'block',
                  marginTop: 15,
                  textAlign: 'center'
                }}
                title="Try out the new v1.13.2"
              >
                V1.13.2 has just been released. Wanna try it out?
                {this.state.latestBtnClicked || this.state.latestInstalled ? (
                  <Link
                    to="/dmanager"
                    style={{ display: 'block', margin: '35px auto' }}
                  >
                    Go to your instances
                  </Link>
                ) : (
                  <Button
                    type="primary"
                    loading={this.props.packCreationLoading}
                    style={{ display: 'block', margin: '35px auto' }}
                    onClick={() => {
                      this.props.createPack('1.13.2', '1.13.2');
                      this.setState({ latestBtnClicked: true });
                    }}
                  >
                    Install and Start v1.13.2
                  </Button>
                )}
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
