import { KVStore } from "@keplr-wallet/common";
import {
  action,
  autorun,
  makeObservable,
  observable,
  runInAction,
  toJS,
} from "mobx";
import { computedFn } from "mobx-utils";
import { Buffer } from "buffer/";
import AES, { Counter } from "aes-js";
import pbkdf2 from "pbkdf2";
import { Hash } from "@keplr-wallet/crypto";
import { PlainObject, Vault } from "./types";

export class VaultService {
  @observable
  protected vaultMap: Map<string, Vault[]> = new Map();

  protected _isSignedUp: boolean = false;

  protected password: Uint8Array = new Uint8Array();
  protected decryptedCache: Map<string, PlainObject> = new Map();

  protected cryptoRandom: Uint8Array = new Uint8Array();

  constructor(protected readonly kvStore: KVStore) {
    makeObservable(this);
  }

  async init(): Promise<void> {
    if (await this.getPasswordCryptoState()) {
      this._isSignedUp = true;
    }

    const cryptoRandom = await this.kvStore.get<string>("cryptoRandom");
    if (cryptoRandom) {
      this.cryptoRandom = Buffer.from(cryptoRandom, "hex");
    } else {
      const rand = new Uint8Array(16);
      crypto.getRandomValues(rand);
      this.cryptoRandom = rand;
      await this.kvStore.set<string>(
        "cryptoRandom",
        Buffer.from(this.cryptoRandom).toString("hex")
      );
    }

    const vaultMap = await this.kvStore.get<Record<string, Vault[]>>(
      "vaultMap"
    );
    if (vaultMap) {
      runInAction(() => {
        for (const [key, value] of Object.entries(vaultMap)) {
          this.vaultMap.set(key, value);
        }
      });
    }
    autorun(() => {
      const js = toJS(this.vaultMap);
      const obj = Object.fromEntries(js);
      this.kvStore.set<Record<string, Vault[]>>("vaultMap", obj);
    });
  }

  get isSignedUp(): boolean {
    return this._isSignedUp;
  }

  async signUp(userPassword: string): Promise<void> {
    if (!this.isLocked) {
      throw new Error("Vault is already unlocked");
    }

    if (this.cryptoRandom.length === 0) {
      throw new Error("Crypto random not initialized");
    }

    if (this.isSignedUp || (await this.getPasswordCryptoState())) {
      throw new Error("Vault is already signed up");
    }

    const encrypted = await VaultService.generatePassword(
      userPassword,
      this.cryptoRandom
    );

    await this.setPasswordCryptoState(encrypted.cipher, encrypted.mac);

    this._isSignedUp = true;

    await this.unlock(userPassword);
  }

  async checkUserPassword(userPassword: string): Promise<void> {
    if (this.isLocked) {
      throw new Error("Vault is not unlocked");
    }

    if (this.cryptoRandom.length === 0) {
      throw new Error("Crypto random not initialized");
    }

    const prevEncrypted = await this.getPasswordCryptoState();
    if (!this.isSignedUp || !prevEncrypted) {
      throw new Error("Vault is not signed up");
    }

    // Make sure to prev user password is valid
    const password = await VaultService.decryptPassword(
      userPassword,
      this.cryptoRandom,
      prevEncrypted.mac,
      prevEncrypted.cipher
    );

    if (
      Buffer.from(password).toString("hex") !==
      Buffer.from(this.password).toString("hex")
    ) {
      throw new Error("Password unmatched");
    }
  }

  async changeUserPassword(
    prevUserPassword: string,
    newUserPassword: string
  ): Promise<void> {
    await this.checkUserPassword(prevUserPassword);

    const newEncrypted = await VaultService.encryptPassword(
      newUserPassword,
      this.cryptoRandom,
      this.password
    );

    await this.setPasswordCryptoState(newEncrypted.cipher, newEncrypted.mac);
  }

  lock() {
    this.password = new Uint8Array(0);
    this.decryptedCache = new Map();
  }

  async unlock(userPassword: string): Promise<void> {
    if (!this.isLocked) {
      throw new Error("Vault is already unlocked");
    }

    if (this.cryptoRandom.length === 0) {
      throw new Error("Crypto random not initialized");
    }

    const encrypted = await this.getPasswordCryptoState();

    if (!encrypted) {
      throw new Error("Vault have not been signed in");
    }

    this.password = await VaultService.decryptPassword(
      userPassword,
      this.cryptoRandom,
      encrypted.mac,
      encrypted.cipher
    );
  }

  get isLocked(): boolean {
    return this.password.length === 0;
  }

  getVaults(type: string): Vault[] {
    const vaults = this.vaultMap.get(type);
    return vaults ?? [];
  }

  getVault = computedFn(
    (type: string, id: string): Vault | undefined => {
      const vaults = this.vaultMap.get(type);
      if (!vaults || vaults.length === 0) {
        return;
      }
      return vaults.find((v) => v.id === id);
    },
    {
      keepAlive: true,
    }
  );

  @action
  addVault(
    type: string,
    insensitive: PlainObject,
    sensitive: PlainObject
  ): string {
    if (!this.vaultMap.has(type)) {
      this.vaultMap.set(type, []);
    }

    const prev = this.vaultMap.get(type)!;
    const rand = new Uint8Array(8);
    crypto.getRandomValues(rand);
    const id = Buffer.from(rand).toString("hex");
    prev.push({
      id,
      insensitive,
      sensitive: this.encrypt(sensitive),
    });
    return id;
  }

  @action
  setAndMergeInsensitiveToVault(
    type: string,
    id: string,
    insensitive: PlainObject
  ): void {
    const vaults = this.vaultMap.get(type);
    if (!vaults || vaults.length === 0) {
      throw new Error(`There is no vault for ${id}`);
    }

    const i = vaults.findIndex((v) => v.id === id);
    if (i < 0) {
      throw new Error(`There is no vault for ${id}`);
    }

    const vault = vaults[i];
    vaults[i] = {
      ...vault,
      insensitive: {
        ...vault.insensitive,
        ...insensitive,
      },
    };
  }

  @action
  removeVault(type: string, id: string): void {
    const vaults = this.vaultMap.get(type);
    if (!vaults || vaults.length === 0) {
      throw new Error(`There is no vault for ${id}`);
    }

    if (!vaults.find((v) => v.id === id)) {
      throw new Error(`There is no vault for ${id}`);
    }

    const newVaults = vaults.filter((v) => v.id !== id);
    this.vaultMap.set(type, newVaults);
  }

  protected encrypt(sensitive: PlainObject): Uint8Array {
    this.ensureUnlockAndState();

    return VaultService.aesEncrypt(
      this.password,
      this.cryptoRandom,
      Buffer.from(JSON.stringify(sensitive))
    );
  }

  decrypt(sensitive: Uint8Array): PlainObject {
    this.ensureUnlockAndState();

    const str = Buffer.from(sensitive).toString("hex");
    const cache = this.decryptedCache.get(str);
    if (cache) {
      return cache;
    }

    const decrypted = JSON.parse(
      Buffer.from(
        VaultService.aesDecrypt(this.password, this.cryptoRandom, sensitive)
      ).toString()
    );
    this.decryptedCache.set(str, decrypted);

    return decrypted;
  }

  protected ensureUnlockAndState(): void {
    if (this.isLocked) {
      throw new Error("Vault is not unlocked");
    }

    if (this.cryptoRandom.length === 0) {
      throw new Error("Crypto random not initialized");
    }
  }

  protected async setPasswordCryptoState(
    cipher: Uint8Array,
    mac: Uint8Array
  ): Promise<void> {
    await this.kvStore.set<string>(
      "passwordCipher",
      Buffer.from(cipher).toString("hex")
    );
    await this.kvStore.set<string>(
      "userPasswordMac",
      Buffer.from(mac).toString("hex")
    );
  }

  protected async getPasswordCryptoState(): Promise<
    | {
        cipher: Uint8Array;
        mac: Uint8Array;
      }
    | undefined
  > {
    const cipherText = await this.kvStore.get<string>("passwordCipher");
    const macText = await this.kvStore.get<string>("userPasswordMac");

    if (cipherText && macText) {
      return {
        cipher: Buffer.from(cipherText, "hex"),
        mac: Buffer.from(macText, "hex"),
      };
    }
  }

  protected static pbkdf2(
    salt: Uint8Array,
    data: Uint8Array
  ): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve, reject) => {
      pbkdf2.pbkdf2(data, salt, 4000, 32, "sha256", (err, derivedKey) => {
        if (err) {
          reject(err);
        } else {
          resolve(new Uint8Array(derivedKey));
        }
      });
    });
  }

  protected static aesEncrypt(
    password: Uint8Array,
    counter: Uint8Array,
    data: Uint8Array
  ): Uint8Array {
    const c = new Counter(0);
    c.setBytes(counter);
    const aesCtr = new AES.ModeOfOperation.ctr(password, c);
    return aesCtr.encrypt(data);
  }

  protected static aesDecrypt(
    password: Uint8Array,
    counter: Uint8Array,
    cipher: Uint8Array
  ): Uint8Array {
    const c = new Counter(0);
    c.setBytes(counter);
    const aesCtr = new AES.ModeOfOperation.ctr(password, c);

    return aesCtr.decrypt(cipher);
  }

  protected static async generatePassword(
    userPassword: string,
    salt: Uint8Array
  ): Promise<{
    cipher: Uint8Array;
    mac: Uint8Array;
  }> {
    const password = new Uint8Array(32);
    crypto.getRandomValues(password);

    return await VaultService.encryptPassword(userPassword, salt, password);
  }

  protected static async encryptPassword(
    userPassword: string,
    salt: Uint8Array,
    password: Uint8Array
  ): Promise<{
    cipher: Uint8Array;
    mac: Uint8Array;
  }> {
    const derivedKey = await VaultService.pbkdf2(
      salt,
      Buffer.from(userPassword)
    );

    const passwordCipher = VaultService.aesEncrypt(derivedKey, salt, password);

    const mac = Hash.sha256(
      Buffer.concat([
        derivedKey.slice(derivedKey.length / 2),
        passwordCipher.slice(passwordCipher.length / 2),
      ])
    );

    return {
      cipher: passwordCipher,
      mac,
    };
  }

  protected static async decryptPassword(
    userPassword: string,
    salt: Uint8Array,
    mac: Uint8Array,
    cipher: Uint8Array
  ): Promise<Uint8Array> {
    const derivedKey = await VaultService.pbkdf2(
      salt,
      Buffer.from(userPassword)
    );

    const derivedMac = Hash.sha256(
      Buffer.concat([
        derivedKey.slice(derivedKey.length / 2),
        cipher.slice(cipher.length / 2),
      ])
    );

    if (
      Buffer.from(derivedMac).toString("hex") !==
      Buffer.from(mac).toString("hex")
    ) {
      throw new Error("User password mac unmatched");
    }

    return VaultService.aesDecrypt(derivedKey, salt, cipher);
  }
}
