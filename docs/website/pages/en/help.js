/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function Help(props) {
  const {config: siteConfig, language = ''} = props;
  const {baseUrl, docsUrl} = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1>About TradeNow</h1>
          </header>
          <p>This project is part of the final year project of a third year
          University of Sussex student. The aim of the project is to explore
          development of decentralised applications through building a simplified
          online marketplace and demonstrate some of the advantages in comparison
          to its centralized web application counterparts.</p>

          <h2>Powered by Ethereum, IPFS, Web3 and React</h2>
          <p>The marketplace is built on the Ethereum blockchain, using smart
          contracts to execute program logic and manage state. For large data
          such as images and files, a decentralised storage system is used to
          reduce the computational costs of executing functions on the blockchain
          and reduce overall gas costs for users to invoke state-changing actions.</p>

          <p>The main cryptocurrency for trading in the marketplace is Ether.</p>

          <p>The Web3 library provides the interface for interacting with the smart
          contracts on the Ethereum blockchain in the JavaScript-based frontend
          application. The UI is built using React, a high-performance library
          for building UIs in the web browser.</p>
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
