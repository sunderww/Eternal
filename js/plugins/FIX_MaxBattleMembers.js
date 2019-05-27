//=============================================================================
// Battle Party Members
//=============================================================================


/*:
 * @plugindesc Change Party Battle Member Size.
 * @author Sunderw
 *
 * @param maxBattleMembers
 * @text Max number of members in battle
 * @type number
 * @default 4
 */

(function() {

  var parameters = PluginManager.parameters('FIX_MaxBattleMembers');

  var oldMaxBattleMembers = Game_Party.prototype.maxBattleMembers;
  Game_Party.prototype.maxBattleMembers = function() {
      return parameters['maxBattleMembers'];
  };

})();
