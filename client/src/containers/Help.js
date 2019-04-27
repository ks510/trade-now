import React, { Component } from "react";
import "./Help.css";

export default class Help extends Component {

  renderGuides = () => {
    return (
      <div className="guides">
        <h2>How To Guides</h2>

        <h4>How do I access the marketplace?</h4>
        <p>Make sure you have an Ethereum account to access the marketplace.
        It is recommended to use the MetaMask chrome extension or a dapp browser.</p>
        <br />
        <h4>How does trading work?</h4>
        <p>When you make a purchase from a listing, the funds are held in escrow
        (using a smart contract) and you must confirm receipt of item before the
        funds are released to the seller to complete the trade.</p>

      </div>
    );

  }

  renderFaqs = () => {
    return (
      <div className="faqs">
        <h2>Frequently Asked Questions</h2>

        <h4>What is TradeNow?</h4>
        <p>TradeNow is a decentralized marketplace powered by Ethereum and IPFS.
        You can buy, sell and trade with other users without paying expensive
        commission fees or entering sensitive payment details.</p>
        <br />
        <h4>How can the marketplace be free to use without charging commission fees?</h4>
        <p>The marketplace runs autonomously on the Ethereum blockchain and is served
        using the IPFS decentralised file system. This means that the dapp is neither
        owned or hosted by a company or single authority who usually charge commission
        fees for maintaining the app. Payments are also handled by the Ethereum network
        (using its cryptocurrency Ether) so third-party payment services like PayPal
        or Stripe are not needed either! However, the Ethereum network itself does
        require a small fee to run the smart contract code in order to keep the
        nodes securing the network (also known as gas). These fees only scale in terms
        of computation power needed to run the code/store data (which is being optmized
        as much as possible!) and does not necessarily scale with selling price of items.</p>
        <br />
        <h4>Why should I trust TradeNow?</h4>
        <p>There is no trust needed at all! The marketplace uses the cutting edge
        technology of smart contracts to secure your trades and data on the blockchain.
        TradeNow is neither owned or hosted by a company or any single authority
        because it runs autonomously on the blockchain network.</p>
        <p>When you purchase a listing in the marketplace, the funds are held in
        a smart contract until you confirm receipt of the item before the funds
        are released to the seller.</p>
        <br />
        <h4>What currencies can I trade in?</h4>
        <p>Currently only Ether (ETH) is supported.</p>
        <br />
        <h4>{"I want to buy/sell with someone but I am afraid they're not going" +
        " to hold up their side of the trade. Can I use TradeNow to do it?"}</h4>
        <p>Yes of course! Simply making a listing with the agreed price and
        once the purchase has been made, the funds will be held in a smart contract
        until the buyer confirms they have received the item. This ensures neither
        side will lose out!</p>
      </div>
    );
  }

  render() {
    return (
      <div className="Help">
        <h1>Help & FAQs</h1>
        <p>Frequently Asked questions and guides on how to use the marketplace.</p>
        <div className="contents">
          {this.renderFaqs()}
          {this.renderGuides()}
        </div>
      </div>
    );
  }
}
