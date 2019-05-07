/*
#=============================================================================
# Balanced Damage Formula
# LeDamageFormula.js
# By Lecode
# Version 1.0
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# - Credits to Lecode
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
#=============================================================================
*/
var Imported = Imported || {};
Imported.LeDamageFormula = true;

var Lecode = Lecode || {};
Lecode.S_DamageFormula = {};
/*:
 * @plugindesc Adds balanced damage formula
 * @author Lecode
 * @version 1.0
 *
 * @help
 * ============================================================================
 * What is this ?
 * ============================================================================
 *
 * This plugin is just a tool to setup damage formula more easily.
 * If your formula is too long or too elaborated you can simply put it bellow.
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeDamageFormula');


/*-------------------------------------------------------------------------
* Game_Action
-------------------------------------------------------------------------*/
Lecode.S_DamageFormula.oldGameAction_evalDamageFormula = Game_Action.prototype.evalDamageFormula;
Game_Action.prototype.evalDamageFormula = function (target) {
    var a = this.subject();
    var b = target;

    this.phyDmg = function (base) {
        //var rawDmg = (a.atk * 4 - b.def * 2) * base * 0.01;
        var rawDmg = base + (a.atk * 4 * base * 0.01);
        var reduction = b.def / (b.def + rawDmg);
        return Math.floor(rawDmg - reduction * rawDmg);
    };
    this.magDmg = function (base) {
        //var rawDmg = (a.mat * 4 - b.mdf * 2) * base * 0.01;

        var rawDmg = base + (a.mat * 4 * base * 0.01);
        var reduction = b.mdf / (b.mdf + rawDmg);
        return Math.floor(rawDmg - reduction * rawDmg);
    };
    return Lecode.S_DamageFormula.oldGameAction_evalDamageFormula.call(this, target);
};
