// TOKEN TRANSFERS

const transactionResult = {
    mintAddress: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    recipientAddress: "FX5qToQUZztsaoTpDiitb9tNCB8L9gEnsoc6Hq38Lfkq",
    amount: 100,
};

const transactionInstructionResult = `
[
    TransactionInstruction {
      keys: [
        {
          pubkey: PublicKey {
            _bn: <BN: 6d06b6361197166b97c2684068eef5e19e9b3404a827ab52f92d2ba558ca6ab0>,
            equals: [Function: equals],
            toBase58: [Function: toBase58],
            toJSON: [Function: toJSON],
            toBytes: [Function: toBytes],
            toBuffer: [Function: toBuffer],
            toString: [Function: toString],
            encode: [Function: encode],
          },
          isSigner: true,
          isWritable: true,
        }, {
          pubkey: PublicKey {
            _bn: <BN: 1533ad2748089df1fa6218b37e403a092c4d755d584c9e3d474af651df78da10>,
            equals: [Function: equals],
            toBase58: [Function: toBase58],
            toJSON: [Function: toJSON],
            toBytes: [Function: toBytes],
            toBuffer: [Function: toBuffer],
            toString: [Function: toString],
            encode: [Function: encode],
          },
          isSigner: false,
          isWritable: true,
        }, {
          pubkey: PublicKey {
            _bn: <BN: d7b88241eae4108fff7e5538927c47750d64ce46a2d124e1608e880727e653ee>,
            equals: [Function: equals],
            toBase58: [Function: toBase58],
            toJSON: [Function: toJSON],
            toBytes: [Function: toBytes],
            toBuffer: [Function: toBuffer],
            toString: [Function: toString],
            encode: [Function: encode],
          },
          isSigner: false,
          isWritable: false,
        }, {
          pubkey: PublicKey {
            _bn: <BN: c6fa7af3bedbad3a3d65f36aabc97431b1bbe4c2d2f6e0e47ca60203452f5d61>,
            equals: [Function: equals],
            toBase58: [Function: toBase58],
            toJSON: [Function: toJSON],
            toBytes: [Function: toBytes],
            toBuffer: [Function: toBuffer],
            toString: [Function: toString],
            encode: [Function: encode],
          },
          isSigner: false,
          isWritable: false,
        }, {
          pubkey: PublicKey {
            _bn: <BN: 0>,
            equals: [Function: equals],
            toBase58: [Function: toBase58],
            toJSON: [Function: toJSON],
            toBytes: [Function: toBytes],
            toBuffer: [Function: toBuffer],
            toString: [Function: toString],
            encode: [Function: encode],
          },
          isSigner: false,
          isWritable: false,
        }, {
          pubkey: PublicKey {
            _bn: <BN: 6ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9>,
            equals: [Function: equals],
            toBase58: [Function: toBase58],
            toJSON: [Function: toJSON],
            toBytes: [Function: toBytes],
            toBuffer: [Function: toBuffer],
            toString: [Function: toString],
            encode: [Function: encode],
          },
          isSigner: false,
          isWritable: false,
        }
      ],
      programId: PublicKey {
        _bn: <BN: 8c97258f4e2489f1bb3d1029148e0d830b5a1399daff1084048e7bd8dbe9f859>,
        equals: [Function: equals],
        toBase58: [Function: toBase58],
        toJSON: [Function: toJSON],
        toBytes: [Function: toBytes],
        toBuffer: [Function: toBuffer],
        toString: [Function: toString],
        encode: [Function: encode],
      },
      data: Buffer(0) [  ],
      toJSON: [Function: toJSON],
    }, TransactionInstruction {
      keys: [
        {
          pubkey: PublicKey {
            _bn: <BN: c3e4a88644d4ee7a688eb82dcd43aa235e34460b83808086ea47251107b64525>,
            equals: [Function: equals],
            toBase58: [Function: toBase58],
            toJSON: [Function: toJSON],
            toBytes: [Function: toBytes],
            toBuffer: [Function: toBuffer],
            toString: [Function: toString],
            encode: [Function: encode],
          },
          isSigner: false,
          isWritable: true,
        }, {
          pubkey: PublicKey {
            _bn: <BN: 1533ad2748089df1fa6218b37e403a092c4d755d584c9e3d474af651df78da10>,
            equals: [Function: equals],
            toBase58: [Function: toBase58],
            toJSON: [Function: toJSON],
            toBytes: [Function: toBytes],
            toBuffer: [Function: toBuffer],
            toString: [Function: toString],
            encode: [Function: encode],
          },
          isSigner: false,
          isWritable: true,
        }, {
          pubkey: PublicKey {
            _bn: <BN: 6d06b6361197166b97c2684068eef5e19e9b3404a827ab52f92d2ba558ca6ab0>,
            equals: [Function: equals],
            toBase58: [Function: toBase58],
            toJSON: [Function: toJSON],
            toBytes: [Function: toBytes],
            toBuffer: [Function: toBuffer],
            toString: [Function: toString],
            encode: [Function: encode],
          },
          isSigner: true,
          isWritable: false,
        }
      ],
      programId: PublicKey {
        _bn: <BN: 6ddf6e1d765a193d9cbe146ceeb79ac1cb485ed5f5b37913a8cf5857eff00a9>,
        equals: [Function: equals],
        toBase58: [Function: toBase58],
        toJSON: [Function: toJSON],
        toBytes: [Function: toBytes],
        toBuffer: [Function: toBuffer],
        toString: [Function: toString],
        encode: [Function: encode],
      },
      data: Buffer(9) [ 3, 0, 225, 245, 5, 0, 0, 0, 0 ],
      toJSON: [Function: toJSON],
    }
  ]
`;

// SOL TRANSFERS
const solTransactionResult = `
{
  transaction: Transaction {        
    signatures: [],
    feePayer: undefined,
    instructions: [
      [Object ...]
    ],
    recentBlockhash: undefined,     
    lastValidBlockHeight: undefined,
    nonceInfo: undefined,
    minNonceContextSlot: undefined, 
    _message: undefined,
    _json: undefined,
    signature: [Getter],
    toJSON: [Function: toJSON],     
    add: [Function: add],
    compileMessage: [Function: compileMessage],
    _compile: [Function: _compile],
    serializeMessage: [Function: serializeMessage],
    getEstimatedFee: [AsyncFunction: getEstimatedFee],
    setSigners: [Function: setSigners],
    sign: [Function: sign],
    partialSign: [Function: partialSign],
    _partialSign: [Function: _partialSign],
    addSignature: [Function: addSignature],
    _addSignature: [Function: _addSignature],
    verifySignatures: [Function: verifySignatures],
    _getMessageSignednessErrors: [Function: _getMessageSignednessErrors],
    serialize: [Function: serialize],
    _serialize: [Function: _serialize],
    keys: [Getter],
    programId: [Getter],
    data: [Getter],
  },
  recipientAddress: "7xKpzXSaga3LkRoMmgKq4j7HbAQj3mdQrY7kMh7ufnQh",
  amount: 1,
}
`;
