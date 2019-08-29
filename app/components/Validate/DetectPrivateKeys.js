/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-console */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import fs from 'fs';
import { EtherKeyPair, BitcoinCheckPair } from 'walletcs/src/index';
import PropTypes from 'prop-types';
import Fade from 'react-reveal/Fade';

import Button from '../Button';
import Table from '../Table';

import { PRIVATE_KEY_PREFIX } from '../../utils/constants';
import { setPrivateKeys } from '../../actions/account';

import styles from '../App/index.css';

class DetectPrivateKeys extends Component {
  componentWillMount() {
    this.setupPrivateKeys();
  }

  setupPrivateKeys = () => {
    let dir = [];
    const { activeDrive, setPrivateKeysAction } = this.props;
    const { path } = activeDrive;

    if (!path) {
      return;
    }

    try {
      dir = fs.readdirSync(path) || [];
    } catch (error) {
      console.error(error);
    }

    const res = dir
      .filter(file => file.startsWith(PRIVATE_KEY_PREFIX))
      .map((file) => {
        let privateKey;
        let publicKey;
        let keyNetwork;
        let keyBlockchain;

        try {
          const privateKeyData = fs.readFileSync(`${path}/${file}`, 'utf-8');
          const privateKeyParsedData = JSON.parse(privateKeyData) || {};
          privateKey = privateKeyParsedData.key;
          keyNetwork = privateKeyParsedData.network;
          keyBlockchain = privateKeyParsedData.blockchain;

          if (keyBlockchain === 'ETH') {
            publicKey = EtherKeyPair.recoveryPublicKey(privateKey);
          } else {
            publicKey = BitcoinCheckPair.recoveryPublicKey(privateKey, keyNetwork);
          }
        } catch (error) {
          console.error(error);
        }

        return {
          privateKey,
          publicKey,
          keyNetwork,
          keyBlockchain,
          account: file.replace(PRIVATE_KEY_PREFIX, '').replace('.json', ''),
        };
      });

    setPrivateKeysAction(res);
  };

  render() {
    const { keys = [], next, onCancel } = this.props;
    const isKeysExists = !!keys.length;

    const data = keys.map(item => ({
      id: item.publicKey,
      flex: [1, 2, 1],
      fields: [item.account, item.publicKey, item.keyNetwork],
    }));

    return (
      <Fade>
        <div className={styles.contentWrapper}>
          {isKeysExists ? (
            <Table data={data} headers={['NAME', 'ADDRESS', 'NETWORK']} />
          ) : (
            <div className={styles.message}>Private keys not found</div>
          )}
        </div>
        <div className={styles.rowControls}>
          <Button onClick={onCancel}>Cancel</Button>
          {isKeysExists && (
            <Button onClick={next} primary>
              Next
            </Button>
          )}
        </div>
      </Fade>
    );
  }
}

DetectPrivateKeys.propTypes = {
  next: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  setPrivateKeysAction: PropTypes.func.isRequired,
  activeDrive: PropTypes.shape({
    path: PropTypes.string,
  }).isRequired,
  keys: PropTypes.array,
};

DetectPrivateKeys.defaultProps = {
  keys: [],
};

const mapStateToProps = state => ({
  keys: state.account.keys,
  activeDrive: state.drive.activeDrive,
});

const mapDispatchToProps = dispatch => ({
  setPrivateKeysAction: keys => dispatch(setPrivateKeys(keys)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetectPrivateKeys);
