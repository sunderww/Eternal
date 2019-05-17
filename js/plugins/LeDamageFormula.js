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
 *
 * ============================================================================
 * @param Bare-Hands Weapon ID
 * @desc The weapon in the database that represents bare-handed.
 * Use when a battler is not holding a weapon.
 * @default 1
 * ============================================================================
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeDamageFormula');

(function ($) {

  /*------------------------------------------------------------------------
  * Helper functions
  -------------------------------------------------------------------------*/
  $.Regex = /<weapon[-_ ]damage>([\s\S]*?)<\/weapon[-_ ]damage>/im
  $.MagicalRegex = /<weapon[-_ ]damage[-_ ]magical>/im
  $.params = PluginManager.parameters("LeDamageFormula");
  $.barehandId = Math.floor($.params["Bare-Hands Weapon ID"]);

  var getWeaponDamage = function(weapon, a, b) {
    if (weapon.damageFormula === undefined) {
      weapon.damageFormula = "0";

      var res = $.Regex.exec(weapon.note);
      if (res) {
        weapon.damageFormula = res[1];
      }
    }

    return eval(weapon.damageFormula);
  };

  var getWeapon = function(battler) {
    var weapons = [];
    if (battler.weapons)
      weapons = battler.weapons();

    // Doesn't allow multi-weapons, so return first result
    return weapons.length > 0 ? weapons[0] : $dataWeapons[$.barehandId];
  }

  var isWeaponMagical = function(weapon) {
    if (weapon.isMagical === undefined) {
      weapon.isMagical = false;
      if (weapon.note.match($.MagicalRegex)) {
        weapon.isMagical = true;
      }
    }
    return weapon.isMagical;
  }

  var getDmg = function(base, atk, def) {
    //var rawDmg = (atk * 4 - def * 2) * base * 0.01;
    var rawDmg = base + (atk * 4 * base * 0.01);
    var reduction = def / (def + rawDmg);
    return Math.floor(rawDmg - reduction * rawDmg);
  }


  /*-------------------------------------------------------------------------
  * Game_Action
  -------------------------------------------------------------------------*/
  $.oldGameAction_evalDamageFormula = Game_Action.prototype.evalDamageFormula;
  Game_Action.prototype.evalDamageFormula = function (target) {
      var a = this.subject();
      var b = target;

      this.getDmg = function(base, atk, def) {
        //var rawDmg = (atk * 4 - def * 2) * base * 0.01;
        var rawDmg = base + (atk * 4 * base * 0.01);
        var reduction = def / (def + rawDmg);
        return Math.floor(rawDmg - reduction * rawDmg);
      };

      this.phyDmg = function (base) {
        return this.getDmg(base, a.atk, b.def);
      };

      this.magDmg = function (base) {
        return this.getDmg(base, a.mat, b.mdf);
      };

      this.agiDmg = function (base) {
        return this.getDmg(base, a.agi, b.def);
      }

      this.weaponDamage = function () {
        var weapon = getWeapon(a);
        var base = getWeaponDamage(weapon, a, b);
        var magical = isWeaponMagical(weapon);

        return magical ? this.magDmg(base) : this.phyDmg(base);
      }

      return $.oldGameAction_evalDamageFormula.call(this, target);
  };

})(Lecode.S_DamageFormula);
