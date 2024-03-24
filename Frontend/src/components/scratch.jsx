import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";
import * as Blockly from 'blockly/core';
import { BlocklyWorkspace, useBlocklyWorkspace } from 'react-blockly';
import 'blockly/blocks';
import locale from 'blockly/msg/en';
import 'blockly/python';
import {pythonGenerator} from 'blockly/python';
import {javascriptGenerator, Order} from 'blockly/javascript';
import 'blockly/javascript';
// Initialize Python generator
// Blockly.Python.initialize();

Blockly.setLocale(locale);



export default function ScratchInterFace () { 

    const [xml, setXml] = useState('');

    const [compile, setCompile] = useState('Compile Model');
    
    // useEffect(() => {

    const [generatedCode, setGeneratedCode] = useState('');
    const [jsCode, setJsCode] = useState('');
    
    // const workspaceTest = useBlocklyWorkspace();
    // const workspaceRef = useRef(null); // Create a ref to store the workspace object

    const handleXmlChange =  (xml) => {
      // Handle the XML code here
      // Convert XML to JavaScript/Python code if needed
      // Convert XML to JavaScript code

      const workspace = new Blockly.Workspace();

      const parser = new DOMParser();

    // Parse the XML text to create a DOM document
      const xmlDoc = parser.parseFromString(xml, 'text/xml');

    Blockly.Xml.domToWorkspace(xmlDoc.documentElement, workspace);

    const pythonCode = pythonGenerator.workspaceToCode(workspace);
    const JSCode = javascriptGenerator.workspaceToCode(workspace);

    setGeneratedCode(pythonCode);
    setJsCode(JSCode);

  };


  pythonGenerator['forBlock']['buy_block'] = function(block, generator) {

    return 'buy()\n';

  };

  javascriptGenerator['forBlock']['buy_block'] = function(block, generator) {
    
    return 'buy()\n';

  };

  pythonGenerator['forBlock']['sell_block'] = function(block, generator) {
    
    return 'sell()\n';

  };

  javascriptGenerator['forBlock']['sell_block'] = function(block, generator) {
    
    return 'sell()\n';

  };
  
  pythonGenerator['forBlock']['moving_average'] = function(block, generator) {
    
    let MAChildBlockLen = block['childBlocks_'].length;
    let type = block.getFieldValue('TYPE');
    let number;

    if (MAChildBlockLen > 0) {
      number = block['childBlocks_'][0]['inputList'][0].fieldRow[0].getValue();
    }    
    else {
      number = '';
    }

    return [`moving_average(type=${type}, number=${number})\n`, Order.NONE];

  };

  javascriptGenerator['forBlock']['moving_average'] = function(block, generator) {

    let MAChildBlockLen = block['childBlocks_'].length;
    let type = block.getFieldValue('TYPE');
    let number;

    if (MAChildBlockLen > 0) {
      number = block['childBlocks_'][0]['inputList'][0].fieldRow[0].getValue();
    }    
    else {
      number = '';
    }

    return [`moving_average(type=${type}, number=${number})\n`, Order.NONE];
    
  };

  pythonGenerator['forBlock']['bbands_block'] = function(block, generator) {

    let operator = block.getFieldValue('OPERATOR');
    let band = block.getFieldValue('BAND');
    return [`bbands(condition=${operator}, band=${band})\n`, Order.NONE];

  };

  javascriptGenerator['forBlock']['bbands_block'] = function(block, generator) {

    let operator = block.getFieldValue('OPERATOR');
    let band = block.getFieldValue('BAND');
    return [`bbands(condition=${operator}, band=${band})\n`, Order.NONE];

  };

  pythonGenerator['forBlock']['momentum_block'] = function(block, generator) {

    let comparison = block.getFieldValue('COMPARISON');
    let threshold = block.getFieldValue('THRESHOLD');
    return [`momentum(comparison=${comparison}, threshold=${threshold})\n`, Order.NONE];

  };

  javascriptGenerator['forBlock']['momentum_block'] = function(block, generator) {

    let comparison = block.getFieldValue('COMPARISON');
    let threshold = block.getFieldValue('THRESHOLD');
    return [`momentum(comparison=${comparison}, threshold=${threshold})\n`, Order.NONE];
    
  };

  pythonGenerator['forBlock']['rsi_block'] = function(block, generator) {
    
    let comparison = block.getFieldValue('COMPARISON');
    let rsi_level = block.getFieldValue('RSI_LEVEL');
    return [`rsi(comparison=${comparison}, rsi_level=${rsi_level})\n`, Order.NONE];

  };

  javascriptGenerator['forBlock']['rsi_block'] = function(block, generator) {

    let comparison = block.getFieldValue('COMPARISON');
    let rsi_level = block.getFieldValue('RSI_LEVEL');
    return [`rsi(comparison=${comparison}, rsi_level=${rsi_level})\n`, Order.NONE];
    
  };

  pythonGenerator['forBlock']['engulfing_block'] = function(block, generator) {

    let engulfingType = block.getFieldValue('TYPE');

    return [`engulfing(type=${engulfingType})`, Order.NONE];

  };

  javascriptGenerator['forBlock']['engulfing_block'] = function(block, generator) {

    
    let engulfingType = block.getFieldValue('TYPE');

    return [`engulfing(type=${engulfingType})`, Order.NONE];

  };

  pythonGenerator['forBlock']['pin_bar_block'] = function(block, generator) {

    let pinBarType = block.getFieldValue('TYPE');

    return [`pinbar(type=${pinBarType})\n`, Order.NONE];

  };

  javascriptGenerator['forBlock']['pin_bar_block'] = function(block, generator) {

    
    let pinBarType = block.getFieldValue('TYPE');

    return [`pinbar(type=${pinBarType})\n`, Order.NONE];

  };

  pythonGenerator['forBlock']['morning_star_block'] = function(block, generator) {

    let morningStarType = block.getFieldValue('TYPE');

    return [`morning_star(type=${morningStarType})\n`, Order.NONE];

  };

  javascriptGenerator['forBlock']['morning_star_block'] = function(block, generator) {

    let morningStarType = block.getFieldValue('TYPE');

    return [`morning_star(type=${morningStarType})\n`, Order.NONE];

  };

  pythonGenerator['forBlock']['three_soldiers_block'] = function(block, generator) {

    let threeType = block.getFieldValue('TYPE');

    return [`soldiers(type=${threeType})\n`, Order.NONE];

  };

  javascriptGenerator['forBlock']['three_soldiers_block'] = function(block, generator) {

    let threeType = block.getFieldValue('TYPE');

    return [`soldiers(type=${threeType})\n`, Order.NONE];

  };

  pythonGenerator['forBlock']['doji_star_block'] = function(block, generator) {

    let dojiType = block.getFieldValue('TYPE');

    return [`doji_star(type=${dojiType})\n`, Order.NONE];

  };

  javascriptGenerator['forBlock']['doji_star_block'] = function(block, generator) {

    let dojiType = block.getFieldValue('TYPE');

    return [`doji_star(type=${dojiType})\n`, Order.NONE];

  };

  pythonGenerator['forBlock']['rising_methods_block'] = function(block, generator) {

    let risingMethodsType = block.getFieldValue('TYPE');

    return [`rising_methods(type=${risingMethodsType})\n`, Order.NONE];

  };

  javascriptGenerator['forBlock']['rising_methods_block'] = function(block, generator) {

    let risingMethodsType = block.getFieldValue('TYPE');

    return [`rising_methods(type=${risingMethodsType})\n`, Order.NONE];

  };

  pythonGenerator['forBlock']['hammer_block'] = function(block, generator) {

    let hammerType = block.getFieldValue('TYPE');

    return [`hammer(type=${hammerType})`, Order.NONE];

  };

  javascriptGenerator['forBlock']['hammer_block'] = function(block, generator) {

    let hammerType = block.getFieldValue('TYPE');

    return [`hammer(type=${hammerType})`, Order.NONE];

  };

  pythonGenerator['forBlock']['shooting_star_block'] = function(block, generator) {

    let shootingStarType = block.getFieldValue('TYPE');

    return [`shooting_star(type=${shootingStarType})`, Order.NONE];

  };

  javascriptGenerator['forBlock']['shooting_star_block'] = function(block, generator) {

    let shootingStarType = block.getFieldValue('TYPE');

    return [`shooting_star(type=${shootingStarType})`, Order.NONE];

  };

  pythonGenerator['forBlock']['dragonfly_doji_block'] = function(block, generator) {

    let dragonFlyType = block.getFieldValue('TYPE');

    return [`dragonfly_doji(type=${dragonFlyType})`, Order.NONE];

  };

  javascriptGenerator['forBlock']['dragonfly_doji_block'] = function(block, generator) {

    let dragonFlyType = block.getFieldValue('TYPE');

    return [`dragonfly_doji(type=${dragonFlyType})`, Order.NONE];

  };

  pythonGenerator['forBlock']['spinning_top_block'] = function(block, generator) {

    let spinningTopType = block.getFieldValue('TYPE');

    return [`spinning_top(type=${spinningTopType})`, Order.NONE];

  };

  javascriptGenerator['forBlock']['spinning_top_block'] = function(block, generator) {

    let spinningTopType = block.getFieldValue('TYPE');

    return [`spinning_top(type=${spinningTopType})`, Order.NONE];

  };

  pythonGenerator['forBlock']['kicker_block'] = function(block, generator) {

    let kickerType = block.getFieldValue('TYPE');

    return [`kicker(type=${kickerType})`, Order.NONE];

  };

  javascriptGenerator['forBlock']['kicker_block'] = function(block, generator) {

    let kickerType = block.getFieldValue('TYPE');

    return [`kicker(type=${kickerType})`, Order.NONE];

  };

  pythonGenerator['forBlock']['harami_block'] = function(block, generator) {

    let haramiType = block.getFieldValue('TYPE');

    return [`harami(type=${haramiType})`, Order.NONE];

  };

  javascriptGenerator['forBlock']['harami_block'] = function(block, generator) {

    let haramiType = block.getFieldValue('TYPE');

    return [`harami(type=${haramiType})`, Order.NONE];

  };

  pythonGenerator['forBlock']['piercing_line_block'] = function(block, generator) {

    let piercingLineType = block.getFieldValue('TYPE');

    return [`piercing_line(type=${piercingLineType})`, Order.NONE];

  };

  javascriptGenerator['forBlock']['piercing_line_block'] = function(block, generator) {

    let piercingLineType = block.getFieldValue('TYPE');

    return [`piercing_line(type=${piercingLineType})`, Order.NONE];

  };

  pythonGenerator['forBlock']['tweezer_block'] = function(block, generator) {

    let tweezerType = block.getFieldValue('TYPE');

    return [`tweezer(type=${tweezerType})`, Order.NONE];

  };

  javascriptGenerator['forBlock']['tweezer_block'] = function(block, generator) {

    let tweezerType = block.getFieldValue('TYPE');

    return [`tweezer(type=${tweezerType})`, Order.NONE];
    
  };

  pythonGenerator['forBlock']['abandoned_baby_block'] = function(block, generator) {

    let abandonedBabyType = block.getFieldValue('TYPE');

    return [`abandoned_baby(type=${abandonedBabyType})`, Order.NONE];

  };

  javascriptGenerator['forBlock']['abandoned_baby_block'] = function(block, generator) {

    
    let abandonedBabyType = block.getFieldValue('TYPE');

    return [`abandoned_baby(type=${abandonedBabyType})`, Order.NONE];
    
  };

  pythonGenerator['forBlock']['three_line_strike_block'] = function(block, generator) {

    let threeLineStrikeType = block.getFieldValue('TYPE');

    return [`three_line_strike(type=${threeLineStrikeType})`, Order.NONE];

  };

  javascriptGenerator['forBlock']['three_line_strike_block'] = function(block, generator) {

    let threeLineStrikeType = block.getFieldValue('TYPE');

    return [`three_line_strike(type=${threeLineStrikeType})`, Order.NONE];
    
  };

   // Blockly block definition for "Moving Average" block
  Blockly.Blocks['moving_average'] = {
    init: function() {
      this.appendValueInput('NUM')
          .setCheck('Number')
          .appendField('Moving Average')
          .appendField('Type');
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ['SMA', 'SMA'],
            ['EMA', 'EMA']
          ]), 'TYPE');
      this.setInputsInline(true);
      this.setOutput(true, 'Number');
      this.setColour(210);
      this.setTooltip('Calculate Moving Average');
      this.setHelpUrl('');
    }
  };  
    
    // Blockly block definition for "Buy" block
Blockly.Blocks['buy_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Buy')
        .setAlign(Blockly.ALIGN_CENTRE); // Set alignment to center
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(120); // Green color
    this.setTooltip('This block represents a buy action');
    this.setHelpUrl('');
  }
};

// Blockly block definition for "Sell" block
Blockly.Blocks['sell_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Sell')
        .setAlign(Blockly.ALIGN_CENTRE); // Set alignment to center
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0); // Red color
    this.setTooltip('This block represents a sell action');
    this.setHelpUrl('');
  }
};

  // Blockly block definition for "Bullish/Bearish Engulfing" block
Blockly.Blocks['engulfing_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Bullish', 'bullish'],
          ['Bearish', 'bearish']
        ]), 'TYPE')
        .appendField('Engulfing');
    this.setOutput(true, 'Boolean');
    this.setColour(330); // Orange color
    this.setTooltip('This block represents an engulfing candlestick pattern');
    this.setHelpUrl('');
  }
};

// Blockly block definition for "Pin Bar" block
Blockly.Blocks['pin_bar_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Bullish', 'bullish'],
          ['Bearish', 'bearish']
        ]), 'TYPE')
        .appendField('Pin Bar');
    this.setOutput(true, 'Boolean');
    this.setColour(330); // Orange color
    this.setTooltip('This block represents a pin bar candlestick pattern');
    this.setHelpUrl('');
  }
};

// Blockly block definition for "Morning Star" block
Blockly.Blocks['morning_star_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Bullish', 'bullish'],
          ['Bearing', 'bearing']
        ]), 'TYPE')
        .appendField('Morning Star');
    this.setOutput(true, 'Boolean');
    this.setColour(330); // Orange color
    this.setTooltip('This block represents a morning star candlestick pattern');
    this.setHelpUrl('');
  }
};


// Blockly block definition for "Three White Soldiers/Black Crows" block
Blockly.Blocks['three_soldiers_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Bullish', 'bullish'],
          ['Bearish', 'bearish']
        ]), 'TYPE')
        .appendField('Three Soldiers/Black Crows');
    this.setOutput(true, 'Boolean');
    this.setColour(330); // Orange color
    this.setTooltip('This block represents the three white soldiers/three black crows candlestick pattern');
    this.setHelpUrl('');
  }
};

// Blockly block definition for "Doji Star" block
Blockly.Blocks['doji_star_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Bullish', 'bullish'],
          ['Bearish', 'bearish']
        ]), 'TYPE')
        .appendField('Doji Star');
    this.setOutput(true, 'Boolean');
    this.setColour(330); // Orange color
    this.setTooltip('This block represents a doji star candlestick pattern');
    this.setHelpUrl('');
  }
};

// Blockly block definition for "Rising Methods/Falling Methods" block
Blockly.Blocks['rising_methods_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Bullish', 'bullish'],
          ['Bearish', 'bearish']
        ]), 'TYPE')
        .appendField('Rising/Falling Methods');
    this.setOutput(true, 'Boolean');
    this.setColour(330); // Orange color
    this.setTooltip('This block represents rising methods/falling methods candlestick pattern');
    this.setHelpUrl('');
  }
};

  // Blockly block definition Hammer/Hanging Man" block
  Blockly.Blocks['hammer_block'] = {
    init: function() {
      this.appendDummyInput()
          .appendField(new Blockly.FieldDropdown([
            ['Bullish', 'bullish'],
            ['Bearish', 'bearish']
          ]), 'TYPE')
          .appendField('Hammer');
      this.setOutput(true, 'Boolean');
      this.setColour(330); // Orange color
      this.setTooltip('This block represents a hammer / hanging man candlestick pattern');
      this.setHelpUrl('');
    }
  };

   // Blockly block definition for "Shooting Star / Inverted Hammer" block
Blockly.Blocks['shooting_star_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Bullish', 'bullish'],
          ['Bearish', 'bearish']
        ]), 'TYPE')
        .appendField('Shooting Star');
    this.setOutput(true, 'Boolean');
    this.setColour(330); // Orange color
    this.setTooltip('This block represents a shooting star / inverted hammer candlestick pattern');
    this.setHelpUrl('');
  }
};

// Blockly block definition for "Dragonfly/Gravestone Doji" block
Blockly.Blocks['dragonfly_doji_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Bullish', 'bullish'],
          ['Bearish', 'bearish']
        ]), 'TYPE')
        .appendField('DragonFly Doji');
    this.setOutput(true, 'Boolean');
    this.setColour(330); // Orange color
    this.setTooltip('This block represents a dragonfly/gravestone doji candlestick pattern');
    this.setHelpUrl('');
  }
};

// Blockly block definition for "Bullish/Bearish Spinning Top" block
Blockly.Blocks['spinning_top_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Bullish', 'bullish'],
          ['Bearish', 'bearish']
        ]), 'TYPE')
        .appendField('Spinning Top');
    this.setOutput(true, 'Boolean');
    this.setColour(330); // Orange color
    this.setTooltip('This block represents a spinning top candlestick pattern');
    this.setHelpUrl('');
  }
};

// Blockly block definition for "Bullish/Bearish Kicker" block
Blockly.Blocks['kicker_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Bullish', 'bullish'],
          ['Bearish', 'bearish']
        ]), 'TYPE')
        .appendField('Kicker');
    this.setOutput(true, 'Boolean');
    this.setColour(330); // Orange color
    this.setTooltip('This block represents a kicker candlestick pattern');
    this.setHelpUrl('');
  }
};

// Blockly block definition for "Bullish/Bearish Harami" block
Blockly.Blocks['harami_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Bullish', 'bullish'],
          ['Bearish', 'bearish']
        ]), 'TYPE')
        .appendField('Harami');
    this.setOutput(true, 'Boolean');
    this.setColour(330); // Orange color
    this.setTooltip('This block represents a harami candlestick pattern');
    this.setHelpUrl('');
  }
};

// Blockly block definition for "Piercing Line/Dark Cloud" block
Blockly.Blocks['piercing_line_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Bullish', 'bullish'],
          ['Bearish', 'bearish']
        ]), 'TYPE')
        .appendField('Piercing Line/Dark Cloud Cover');
    this.setOutput(true, 'Boolean');
    this.setColour(330); // Orange color
    this.setTooltip('This block represents a Piercing Line/Dark Cloud Cover candlestick pattern');
    this.setHelpUrl('');
  }
};

// Blockly block definition for "Tweezer Top/Bottom" block
Blockly.Blocks['tweezer_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Bullish', 'bullish'],
          ['Bearish', 'bearish']
        ]), 'TYPE')
        .appendField('Tweezer Top/Bottom');
    this.setOutput(true, 'Boolean');
    this.setColour(330); // Orange color
    this.setTooltip('This block represents a Tweezer Top/Bottom candlestick pattern');
    this.setHelpUrl('');
  }
};

// Blockly block definition for "Abandoned Baby" block
Blockly.Blocks['abandoned_baby_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Bullish', 'bullish'],
          ['Bearish', 'bearish']
        ]), 'TYPE')
        .appendField('Abandoned Baby');
    this.setOutput(true, 'Boolean');
    this.setColour(330); // Orange color
    this.setTooltip('This block represents a Abandoned Baby candlestick pattern');
    this.setHelpUrl('');
  }
};

// Blockly block definition for "Three Line Strike" block
Blockly.Blocks['three_line_strike_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Bullish', 'bullish'],
          ['Bearish', 'bearish']
        ]), 'TYPE')
        .appendField('Three Line Strike');
    this.setOutput(true, 'Boolean');
    this.setColour(330); // Orange color
    this.setTooltip('This block represents a Three Line Strike candlestick pattern');
    this.setHelpUrl('');
  }
};

// Blockly block definition for "Bollinger Bands" block
Blockly.Blocks['bbands_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Bollinger Bands');
    this.appendValueInput('PRICE')
        .setCheck('Number')
        .appendField('Price');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['<', 'LT'],
          ['>', 'GT'],
          ['=', 'EQ']
        ]), 'OPERATOR');
    this.appendDummyInput()
        .appendField('the');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['upper band', 'UPPER'],
          ['lower band', 'LOWER']
        ]), 'BAND');
    this.setOutput(true, 'Boolean');
    this.setColour(210); // Light blue color
    this.setTooltip('This block compares the current price with Bollinger Bands to output a boolean value based on the specified condition');
    this.setHelpUrl('');
  }
};


    // Blockly block definition for "Momentum" block
Blockly.Blocks['momentum_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Momentum');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['>', 'ABOVE'],
          ['<', 'BELOW']
        ]), 'COMPARISON');
    this.appendDummyInput()
        .appendField('Value')
        .appendField(new Blockly.FieldNumber(0), 'THRESHOLD');
    this.setOutput(true, 'Boolean');
    this.setColour(210); // Light blue color
    this.setTooltip('This block checks if the momentum is above or below a certain threshold');
    this.setHelpUrl('');
  }
};


  // Blockly block definition for "RSI (Relative Strength Index)" block
Blockly.Blocks['rsi_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('RSI');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['>', 'ABOVE'],
          ['<', 'BELOW']
        ]), 'COMPARISON');
    this.appendDummyInput()
        .appendField('level')
        .appendField(new Blockly.FieldNumber(0), 'RSI_LEVEL');
    this.setOutput(true, 'Boolean');
    this.setColour(210); // Light blue color
    this.setTooltip('This block checks if the RSI level is above or below a specified number');
    this.setHelpUrl('');
  }
};

    const MY_TOOLBOX = {
      "kind": "categoryToolbox",
      "contents": [
        {
          "kind": "category",
          "name": "Control",
          "contents": [
            {
              "kind": "block",
              "type": "controls_if"
            },
            {
              "kind": "block",
              "type": "controls_whileUntil"
            },
            {
              "kind": "block",
              "type": "controls_repeat_ext"
            },
            {
              "kind": "block",
              "type": "controls_for"
            },
            {
              "kind": "block",
              "type": "controls_flow_statements"
            }
          ]
        },
        {
          "kind": "category",
          "name": "Logic",
          "contents": [
            {
              "kind": "block",
              "type": "logic_compare"
            },
            {
              "kind": "block",
              "type": "logic_operation"
            },
            {
              "kind": "block",
              "type": "logic_boolean"
            },
            {
              "kind": "block",
              "type": "logic_null"
            }
          ]
        },
        {
          "kind": "category",
          "name": "Math",
          "contents": [
            {
              "kind": "block",
              "type": "math_number"
            },
            {
              "kind": "block",
              "type": "math_arithmetic"
            },
            {
              "kind": "block",
              "type": "math_random_int"
            },
            {
              "kind": "block",
              "type": "math_round"
            },
            {
              "kind": "block", 
              "type": "math_modulo"
            },
            
            // {
            //   "kind": "block",
            //   "type": "math_const"
            // }
            // { "kind": "block", 
            // "type": "math_modulo" 
            // },
        // { "kind": "block", "type": "math_const" }
          ]
        },
        
        {
          "kind": "category",
          "name": "Variables",
          "contents": [
            {
              "kind": "block",
              "type": "variables_get"
            },
            {
              "kind": "block",
              "type": "variables_set"
            },
            {
              "kind": "block",
              "type": "variables_get_dynamic"
            },
            {
              "kind": "block",
              "type": "variables_set_dynamic"
            }
          ]
        },
        {
          "kind": "category",
          "name": "Lists",
          "contents": [
            { "kind": "block", "type": "lists_create_with" },
            { "kind": "block", "type": "lists_length" },
            { "kind": "block", "type": "lists_isEmpty" }
          ]
        },

        {
          "kind": "category",
          "name": "Order Type",
          "contents": [
            {
              "kind": "block",
              "type": "buy_block" // Add the custom "Buy" block here
            },
            {
              "kind": "block",
              "type": "sell_block" // Add the custom "Sell" block here
            },
          ]
        },
        {
          "kind": "category",
          "name": "Candlestick Patterns", // Change the name as desired
          "contents": [
            
            {
              "kind": "block",
              "type": "engulfing_block" // Add the "Bullish/Bearish Engulfing" block here
            },
            {
              "kind": "block",
              "type": "pin_bar_block" // Add the "Pin Bar" block here
            },
            {
              "kind": "block",
              "type": "morning_star_block" // Add the "Morning Star" block here
            },
            
            {
              "kind": "block",
              "type": "three_soldiers_block" // Add the "Three White Soldiers/Black Crows" block here
            },
            {
              "kind": "block",
              "type": "doji_star_block" // Add the "Doji Star" block here
            },
            {
              "kind": "block",
              "type": "rising_methods_block" // Add the "Rising Methods/Falling Methods" block here
            },
            {
              "kind": "block",
              "type": "hammer_block"
            },
            {
              "kind": "block",
              "type": "shooting_star_block"
            },
            {
              "kind": "block",
              "type": "dragonfly_doji_block"
            },
            {
              "kind": "block",
              "type": "spinning_top_block"
            },
            {
              "kind": "block",
              "type": "kicker_block"
            },
            {
              "kind": "block",
              "type": "harami_block"
            },
            {
              "kind": "block",
              "type": "piercing_line_block"
            },
            {
              "kind": "block",
              "type": "tweezer_block"
            },
            {
              "kind": "block",
              "type": "abandoned_baby_block"
            },
            {
              "kind": "block",
              "type": "three_line_strike_block"
            },
            // Add more custom blocks here if needed
          ]
        },
        {
          "kind": "category",
          "name": "Technical Indicators",
          "contents": [
            {
              "kind": "block",
              "type": "moving_average" // Add the custom "Moving Average" block here
            },
            
            {
              "kind": "block",
              "type": "bbands_block" // Add the "Bollinger Bands" block here
            },
            {
              "kind": "block",
              "type": "momentum_block" // Add the "Momentum" block here
            },
            {
              "kind": "block",
              "type": "rsi_block" // Add the custom "RSI" block here
            }
            
          ]
        },
      ]
    }
      
      const compileModelFunction = () => {
        if (compile == 'Compile Model') {
          setCompile('Compiling Model...')
        }
        else {
          setCompile('Compile Model')
        }
      }

      return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">  
                <h5>Genesys Interface:</h5><br />
                <h2>Generated Code:</h2>
                <div className="generated-code-example">
                
                  <div>
                    <h3>Python</h3>
                    <pre>{generatedCode}</pre>
                  </div>
                  <div>
                    
                    <h3>JavaScript</h3>
                    <pre>{jsCode}</pre>
                  </div>
                </div><br />
                <BlocklyWorkspace
                className="" // you can use whatever classes are appropriate for your app's CSS
                toolboxConfiguration={MY_TOOLBOX} // this must be a JSON toolbox definition
                initialXml={xml}
                onXmlChange={handleXmlChange}
              /><br /> 
              <button className="btn btn-primary backtest-button" onClick={compileModelFunction}>{compile}</button>
              <br /><br />
            </div>
            </div>
        </div>
    )
}
