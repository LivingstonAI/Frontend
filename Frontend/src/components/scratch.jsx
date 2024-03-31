import React, { useEffect, useState, useRef } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Link, json } from "react-router-dom";
import * as Blockly from 'blockly/core';
import { BlocklyWorkspace, useBlocklyWorkspace } from 'react-blockly';
import 'blockly/blocks';
import locale from 'blockly/msg/en';
import 'blockly/python';
import {pythonGenerator} from 'blockly/python';
import {javascriptGenerator, Order} from 'blockly/javascript';
import DataSetsModal from "./datasets_modal";
import useForceUpdate from 'use-force-update';

import 'blockly/javascript';
// Initialize Python generator
// Blockly.Python.initialize();

Blockly.setLocale(locale);



export default function ScratchInterFace () { 

    const [xml, setXml] = useState('');

    const [compile, setCompile] = useState('Compile Model');
    
    const [generatedCode, setGeneratedCode] = useState('');
    const [jsCode, setJsCode] = useState('');

    const [modelPerformance, setModelPerformance] = useState('');

    const baseUrl = 'https://backend-production-c0ab.up.railway.app';

    const [isDataSetModalOpen, setIsDataSetModalOpen] = useState(false);

    const forceUpdate = useForceUpdate();
    const [xauuData, setXauusd] = useState(['XAUUSD5M.csv', 'XAUUSD15M.csv', 'XAUUSD30M.csv', 
    'XAUUSD1H.csv', 'XAUUSD4H.csv', 'XAUUSD1D.csv']);

    const [eurusdData, setEurusdData] = useState(['EURUSD5M.csv', 'EURUSD15M.csv', 'EURUSD30M.csv',
    'EURUSD1H.csv', 'EURUSD4H.csv', 'EURUSD1D.csv']);

    const [gbpusdData, setGbpusdData] = useState(['GBPUSD5M.csv', 'GBPUSD15M.csv', 'GBPUSD30M.csv',
    'GBPUSD1H.csv','GBPUSD4H.csv', 'GBPUSD1D.csv']);

    const [usdjpyData, setUjpyusdData] = useState(['USDJPY5M.csv', 'USDJPY15M.csv', 'USDJPY30M.csv',
    'USDJPY1H.csv','USDJPY4H.csv', 'USDJPY1D.csv']);

    const [chosenDataSet, setChosenDataSet] = useState('');


    const handleXmlChange =  (xml) => {

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

    return 'self.buy()\n';

  };

  javascriptGenerator['forBlock']['buy_block'] = function(block, generator) {
    
    return 'self.buy()\n';

  };

  pythonGenerator['forBlock']['sell_block'] = function(block, generator) {
    
    return 'self.sell()\n';

  };

  javascriptGenerator['forBlock']['sell_block'] = function(block, generator) {
    
    return 'self.sell()\n';

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

    return [`moving_average(type='${type}', number=${number}, data=dataset)`, Order.NONE];

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

    return [`moving_average(type=${type}, number=${number})`, Order.NONE];
    
  };

  pythonGenerator['forBlock']['bbands_block'] = function(block, generator) {

    let operator = block.getFieldValue('OPERATOR');
    let band = block.getFieldValue('BAND');
    return [`bbands(condition='${operator}', band='${band}', data=dataset)`, Order.NONE];

  };

  javascriptGenerator['forBlock']['bbands_block'] = function(block, generator) {

    let operator = block.getFieldValue('OPERATOR');
    let band = block.getFieldValue('BAND');
    return [`bbands(condition=${operator}, band=${band})`, Order.NONE];

  };

  pythonGenerator['forBlock']['momentum_block'] = function(block, generator) {

    let comparison = block.getFieldValue('COMPARISON');
    let threshold = block.getFieldValue('THRESHOLD');
    return [`momentum(comparison='${comparison}', threshold=${threshold}, data=dataset)`, Order.NONE];

  };

  javascriptGenerator['forBlock']['momentum_block'] = function(block, generator) {

    let comparison = block.getFieldValue('COMPARISON');
    let threshold = block.getFieldValue('THRESHOLD');
    return [`momentum(comparison='${comparison}', threshold=${threshold}, data=dataset)`, Order.NONE];
    
  };

  pythonGenerator['forBlock']['rsi_block'] = function(block, generator) {
    
    let comparison = block.getFieldValue('COMPARISON');
    let rsi_level = block.getFieldValue('RSI_LEVEL');
    return [`rsi(comparison='${comparison}', rsi_level=${rsi_level}, data=dataset)`, Order.NONE];

  };

  javascriptGenerator['forBlock']['rsi_block'] = function(block, generator) {

    let comparison = block.getFieldValue('COMPARISON');
    let rsi_level = block.getFieldValue('RSI_LEVEL');
    return [`rsi(comparison=${comparison}, rsi_level=${rsi_level})`, Order.NONE];
    
  };

  pythonGenerator['forBlock']['engulfing_block'] = function(block, generator) {

    let engulfingType = block.getFieldValue('TYPE');

    if (engulfingType === 'bullish') {
      return [`is_bullish_engulfing(data=dataset)`, Order.NONE];
    } else if (engulfingType === 'bearish'){
      return [`is_bearish_engulfing(data=dataset)`, Order.NONE];
    }


  };

  javascriptGenerator['forBlock']['engulfing_block'] = function(block, generator) {
    
    let engulfingType = block.getFieldValue('TYPE');

    return [`engulfing(type='${engulfingType}')`, Order.NONE];

  };


  pythonGenerator['forBlock']['morning_star_block'] = function(block, generator) {

    let morningStarType = block.getFieldValue('TYPE');
    if (morningStarType === 'bullish') {
      return [`is_morning_star(data=dataset)`, Order.NONE];
    } else if (morningStarType === 'bearish') {
      return [`is_evening_star(data=dataset)`, Order.NONE];
    }

  };

  javascriptGenerator['forBlock']['morning_star_block'] = function(block, generator) {

    let morningStarType = block.getFieldValue('TYPE');

    return [`morning_star(type=${morningStarType})`, Order.NONE];

  };

  pythonGenerator['forBlock']['three_soldiers_block'] = function(block, generator) {

    let threeType = block.getFieldValue('TYPE');
    if (threeType === 'bullish') {
      return [`is_three_white_soldiers(data=dataset)`, Order.NONE];
    } else if (threeType === 'bearish') {
      return [`is_three_black_crows(data=dataset)`, Order.NONE];
    }

  };

  javascriptGenerator['forBlock']['three_soldiers_block'] = function(block, generator) {

    let threeType = block.getFieldValue('TYPE');

    return [`soldiers(type=${threeType})`, Order.NONE];

  };

  pythonGenerator['forBlock']['doji_star_block'] = function(block, generator) {

    let dojiType = block.getFieldValue('TYPE');
    if (dojiType === 'bullish') {
      return [`is_morning_doji_star(data=dataset)`, Order.NONE];
    } else if (dojiType === 'bearish') {
      return [`is_evening_doji_star(data=dataset)`, Order.NONE];
    }

  };

  javascriptGenerator['forBlock']['doji_star_block'] = function(block, generator) {

    let dojiType = block.getFieldValue('TYPE');

    return [`doji_star(type=${dojiType})`, Order.NONE];

  };

  pythonGenerator['forBlock']['rising_methods_block'] = function(block, generator) {

    let risingMethodsType = block.getFieldValue('TYPE');
    if (risingMethodsType === 'bullish') {
      return [`is_rising_three_methods(data=dataset)`, Order.NONE];
    } else if (risingMethodsType === 'bearish') {
      return [`is_falling_three_methods(data=dataset)`, Order.NONE];
    }
    
  };

  javascriptGenerator['forBlock']['rising_methods_block'] = function(block, generator) {

    let risingMethodsType = block.getFieldValue('TYPE');

    return [`rising_methods(type=${risingMethodsType})`, Order.NONE];

  };

  pythonGenerator['forBlock']['hammer_block'] = function(block, generator) {

    let hammerType = block.getFieldValue('TYPE');
    if (hammerType === 'bullish') {
      return [`is_hammer(data=dataset)`, Order.NONE];
    } else if (hammerType === 'bearish') {
      return [`is_hanging_man(data=dataset)`, Order.NONE];
    }
    // is_hammer(df)


  };

  javascriptGenerator['forBlock']['hammer_block'] = function(block, generator) {

    let hammerType = block.getFieldValue('TYPE');

    return [`hammer(type=${hammerType})`, Order.NONE];

  };

  pythonGenerator['forBlock']['shooting_star_block'] = function(block, generator) {

    let shootingStarType = block.getFieldValue('TYPE');
    if (shootingStarType === 'bullish') {
      return [`is_inverted_hammer(data=dataset)`, Order.NONE];
    } else if (shootingStarType === 'bearish') {
      return [`is_shooting_star(data=dataset)`, Order.NONE];
    }

  };

  javascriptGenerator['forBlock']['shooting_star_block'] = function(block, generator) {

    let shootingStarType = block.getFieldValue('TYPE');

    return [`shooting_star(type=${shootingStarType})`, Order.NONE];

  };

  pythonGenerator['forBlock']['kicker_block'] = function(block, generator) {

    let kickerType = block.getFieldValue('TYPE');
    if (kickerType === 'bullish') {
      return [`is_bullish_kicker(data=dataset)`, Order.NONE];
    } else if (kickerType === 'bearish') {
      return [`is_bearish_kicker(data=dataset)`, Order.NONE];
    }
  };

  javascriptGenerator['forBlock']['kicker_block'] = function(block, generator) {

    let kickerType = block.getFieldValue('TYPE');

    return [`kicker(type=${kickerType})`, Order.NONE];

  };

  pythonGenerator['forBlock']['harami_block'] = function(block, generator) {

    let haramiType = block.getFieldValue('TYPE');

    if (haramiType === 'bullish') {
      return [`is_bullish_harami(data=dataset)`, Order.NONE];
    } else if (haramiType === 'bearish') {
      return [`is_bearish_harami(data=dataset)`, Order.NONE];
    }

  };

  javascriptGenerator['forBlock']['harami_block'] = function(block, generator) {

    let haramiType = block.getFieldValue('TYPE');

    return [`harami(type=${haramiType})`, Order.NONE];

  };

  pythonGenerator['forBlock']['three_line_strike_block'] = function(block, generator) {

    let threeLineStrikeType = block.getFieldValue('TYPE');
    if (threeLineStrikeType === 'bullish') {
      return [`is_bullish_three_line_strike(data=dataset)`, Order.NONE];
    } else if (threeLineStrikeType === 'bearish') {
      return [`is_bearish_three_line_strike(data=dataset)`, Order.NONE];
    }


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


// Blockly block definition for "Morning Star" block
Blockly.Blocks['morning_star_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['Bullish', 'bullish'],
          ['Bearish', 'bearish']
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
        ]), 'OPERATOR');
    this.appendDummyInput()
        .appendField('the');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          ['upper band', 'UPPER'],
          ['middle band', 'MIDDLE'],
          ['lower band', 'LOWER'],
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
              "type": "kicker_block"
            },
            {
              "kind": "block",
              "type": "harami_block"
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

      setCompile('Backtesting model...');

      fetch(`${baseUrl}/save-dataset/${chosenDataSet}`, {
        method: 'POST', // or 'GET' depending on your Django view
        headers: {
          'Content-Type': 'application/json',
          // You might need to include CSRF token if required by your Django setup
          // 'X-CSRFToken': csrfToken, // Include CSRF token if required
        },
        // body: JSON.stringify({ dataset }), // Include data in the body if required
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data); // Do something with the response data
      })
      .catch(error => {
        console.error('Error:', error);
      });



      console.log(generatedCode);
      fetch(`${baseUrl}/genesys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'generatedCode': generatedCode }),
      })
        .then(response => response.json())
        .then(data => {

          console.log('Returned Data');
          console.log(data);
          // Replace "nan" with null
          const jsonStringFixed = data.message.replace(/'nan'/g, 'null');
          
          // Replace single quotes with double quotes
          const jsonStringDoubleQuoted = jsonStringFixed.replace(/'/g, '"');
          
          // Parse the JSON string into a JavaScript object
          const jsonData = JSON.parse(jsonStringDoubleQuoted);
      
          setModelPerformance(jsonData);

          setCompile('Compile Model');
        })
        .catch(error => {
          console.error('Error:', error);
          setCompile('Error Occured');
        });
    };

    const toggleModal = () => {
      // forceUpdate();
      setIsDataSetModalOpen(!isDataSetModalOpen);
    };

    const closeModal = async () => {  
      // Handle success
      // window.location.reload();
      toggleModal();
    };

    const handleButtonClick = (data) => {
      setChosenDataSet(data);
    };

      return (
        <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info">  <br />
                <h5>Genesys Interface:</h5><br />
                <h2>Generated Code:</h2>
                <div className="generated-code-example">
                
                  <div>
                    <h3>Python</h3>
                    <pre>{generatedCode}</pre>
                  </div>
                  
                  {/* <div>
                    
                    <h3>JavaScript</h3>
                    <pre>{jsCode}</pre>
                  </div> */}
                </div>
                <div className="choose-dataset">
                    <button className="btn btn-light" onClick={toggleModal}>Choose Dataset</button><br /><br />
                    <p>Chosen dataset: {chosenDataSet}</p>
                    {isDataSetModalOpen && (
                <div className="modal-overlay">
                    <div className="select-category-modal">
                        <br />
                        <h4 className="select-category-title">Choose Dataset</h4><br />
                        <button className="btn btn-light close-cot-modal" onClick={closeModal}>Close</button><br /><br />
                        {isDataSetModalOpen && (
                            <p>Chosen dataset: {chosenDataSet}</p>
                        )}
                        <p><b>XAUUSD</b></p>
                        
                            {xauuData.map((data, index) => (
                                <button 
                                    className="btn btn-light" 
                                    key={index}
                                    onClick={() => handleButtonClick(data)}
                                >
                                    {data}
                                </button>
                            ))}<br /><br />
                            <p><b>EURUSD</b></p>
                            {eurusdData.map((data, index) => (
                                <button 
                                    className="btn btn-light" 
                                    key={index}
                                    onClick={() => handleButtonClick(data)}
                                >
                                    {data}
                                </button>
                            ))}
                        <br /><br />
                            <p><b>GBPUSD</b></p>
                            {gbpusdData.map((data, index) => (
                                <button 
                                    className="btn btn-light" 
                                    key={index}
                                    onClick={() => handleButtonClick(data)}
                                >
                                    {data}
                                </button>
                            ))}
                            <br /><br />
                            <p><b>USDJPY</b></p>
                            {usdjpyData.map((data, index) => (
                                <button 
                                    className="btn btn-light" 
                                    key={index}
                                    onClick={() => handleButtonClick(data)}
                                >
                                    {data}
                                </button>
                            ))}
                        <br /><br /><br /><br /><br />
                    </div>
                </div>
            )}

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
            </div><br /><br />

            {modelPerformance && (

              <div className="model-performance">
              {/* {modelResult} */}
              <p># Trades: {modelPerformance['# Trades']}</p>
              <p>Start: {modelPerformance.Start}</p>
              <p>End: {modelPerformance.End}</p>
              <p>Duration: {modelPerformance.Duration}</p>
              <p>Return [%]: {modelPerformance['Return [%]']}</p>
              <p>Return (Ann.) [%]: {modelPerformance['Return (Ann.) [%]']}</p>
              <p>Win Rate [%]: {modelPerformance['Win Rate [%]']}</p>
              <p>Best Trade [%]: {modelPerformance['Best Trade [%]']}</p>
              <p>Worst Trade [%]: {modelPerformance['Worst Trade [%]']}</p>
              <p>Equity Final [$]: {modelPerformance['Equity Final [$]']}</p>
              <p>Equity Peak [$]: {modelPerformance['Equity Peak [$]']}</p>
              <p>Max. Drawdown Duration: {modelPerformance['Max. Drawdown Duration']}</p>
              <p>Avg. Drawdown Duration: {modelPerformance['Avg. Drawdown Duration']}</p>
              <p>Avg. Drawdown [%]: {modelPerformance['Avg. Drawdown [%]']}</p>
              <p>Avg. Trade Duration: {modelPerformance['Avg. Trade Duration']}</p>
              <p>Avg. Trade [%]: {modelPerformance['Avg. Trade [%]']}</p>
              <p>Buy & Hold Return [%]: {modelPerformance['Buy & Hold Return [%]']}</p>
              <p>Calmar Ratio: {modelPerformance['Calmar Ratio']}</p>
              <p>Expectancy [%]: {modelPerformance['Expectancy [%]']}</p>
              <p>Exposure Time [%]: {modelPerformance['Exposure Time [%]']}</p>
              <p>Max. Drawdown [%]: {modelPerformance['Max. Drawdown [%]']}</p>
              <p>Max. Trade Duration: {modelPerformance['Max. Trade Duration']}</p>
              <p>Profit Factor: {modelPerformance['Profit Factor']}</p>
              {/* <p>SQN: {modelPerformance.SQN}</p> */}
              <p>Sharpe Ratio: {modelPerformance['Sharpe Ratio']}</p>
              <p>Sortino Ratio: {modelPerformance['Sortino Ratio']}</p>
              <p>Volatility (Ann.) [%]: {modelPerformance['Volatility (Ann.) [%]']}</p>
            </div>
            )}
        </div>
    )
}
