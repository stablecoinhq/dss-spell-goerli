# Dss-Spell Goerli

- パラメーター変更実行に利用したspellを管理するレポジトリ

## コマンド一覧

`npx hardhat --help`で一覧表示される。大事なのは次の５つ

| Command        | Description                                     |
| -------------- | ----------------------------------------------- |
| deploy-lib     | Deploy dss exec lib                             |
| deploy-spell   | Deploy DssSpell contract                        |
| vote-spell     | Vote DssSpell contract                          |
| schedule-spell | Schedule DssSpell contract                      |
| execute-spell  | Execute DssSpell contract                       |
| unlock-tokens  | Unlock all the tokens that was used for voting  |

## 一連の流れ

1. `contracts`ディレクトリにて`DssSpell.sol`を定義する
2. （初回のみ): `deploy-lib`で DssExecLib をデプロイする。
3. `deploy-spell`で 1.の DssSpell をデプロイする
4. (MKR トークンがある場合のみ) `vote-spell`で 3.の spell に対して vote を行う
5. (投票が十分集まった場合のみ) `schedule-spell`で 3.の spell をスケジュールする
6. 十分に時間が経過したら`execute-spell`で spell の実行を行う。

コマンドに直すをこうなる:

```terminal
npx hardhat deploy-lib --network localhost
npx hardhat deploy-spell --network localhost
npx hardhat vote-spell --address $(cat dss-spell.address) --network localhost
npx hardhat schedule-spell --address $(cat dss-spell.address) --network localhost
npx hardhat execute-spell ---address $(cat dss-spell.address) --network localhost
```
