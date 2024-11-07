---
title: Introduction
description: DeepWallet is a non-custodial blockchain wallets for webpages that allow users to interact with blockchain applications.
footer:
  newsletter: false
aside: true
order: 1
---

# DeepWallet wallet Documentation

## Introduction

DeepWallet is a non-custodial blockchain wallets for webpages that allow users to interact with blockchain applications.

## Why DeepWallet?

- Private keys are stored locally. This removes the friction and risk of webpages having to manage user private keys safely and securely.
- As the user's private key is not managed by the website, users do not have to worry about the level of security of the website. The user only has to trust the security guarantees of DeepWallet, and freely interact with various web applications as they wish (and verify the contents of the transaction).
- DeepWallet can easily connect to libraries such as CosmJS, simplifying the process of connecting webpages to blockchains.

## Sections
[Integrate with DeepWallet](./api) describes how to integrate with DeepWallet in the webpage.  

[Use with cosmjs](./api/cosmjs.md) describes how to use cosmjs with DeepWallet.

[Use with secretjs](./api/secretjs.md) describes how to use secretjs with DeepWallet if you need to use secret-wasm feature.
  
[Suggest chain](./api/suggest-chain.md) describes how to suggest the chain to DeepWallet if the chain is not supported natively in DeepWallet.
