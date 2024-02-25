import React, { useEffect, useState } from "react";
import Header from "./header";
import SideNavs from "./side_navs";
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";


export default function RiskBot () {

    const baseURL = 'https://backend-production-c0ab.up.railway.app';

    const downloadFile = async () => {
      try {
          const response = await fetch(`${baseURL}/download-mq4/risk-bot`);
          const fileContent = await response.blob();
  
          // Create a Blob from the file content with the appropriate type
          const blob = new Blob([fileContent], { type: 'application/octet-stream' });
  
          // Create a URL for the Blob
          const url = window.URL.createObjectURL(blob);
  
          // Create a link element
          const link = document.createElement('a');
          link.href = url;
          link.download = 'risk-bot.ex5'; // Set the desired filename
  
          // Append the link to the body
          document.body.appendChild(link);
  
          // Trigger the download
          link.click();
  
          // Clean up and remove the link
          document.body.removeChild(link);
      } catch (error) {
          console.error('Error downloading file:', error);
      }
  };
  
  
    return (
    <div>
            <div className="header">
                <Header />
            </div>
            <div className="main-page-body">
                <SideNavs />
                <div className="main-body-info"><br />
                    <h5>Risk Bot</h5>
                    <h5><button className="btn btn-success" onClick={downloadFile}><i className="bi bi-download"></i> Download Risk Bot</button></h5><br />
                    <h6 className="risk-bot-header">What is Risk Bot?</h6>

Risk Bot is our pioneering tool designed to protect your capital and manage trading risk with 
precision. With this powerful assistant, you can trade with greater confidence, knowing that 
your investments are being monitored around the clock. <br /><br />

<h6 className="risk-bot-header">Key Features of Risk Bot:</h6>

<h6 className="risk-bot-header">Capital Protection: </h6>Simply input your initial capital and define the maximum amount
 you're willing to risk on a trade. Risk Bot vigilantly oversees your trades, ensuring that any
  potential loss doesn't exceed your specified threshold. <br /> <br />
  
<h6 className="risk-bot-header">Automated Risk Management:</h6> If a trade goes south and your losses approach the 
boundary you've set, Risk Bot springs into action, closing the trade automatically. This happens 
without any intervention on your part and won't impact your profitable trades, allowing them the 
freedom to grow. <br /><br />

<h6 className="risk-bot-header">How to Install Risk Bot:</h6>

<p>1. Open your MT5 terminal.</p>
<p>2. Navigate to "File" in the top menu bar.</p>
<p>3. Click "Open Data Folder."</p>
<p>4. Within the subsequent window, follow the path: MQL5, Experts.</p>
<p>5. Drag and drop your downloaded Risk Bot file into this folder.</p>
<p>6. Close your MT5 terminal.</p>
<p>7. Reopen your terminal.</p>
<p>8. Find Risk Bot in the 'Navigator' under 'Experts Advisors'.</p>
<p>9. Drag and drop Risk Bot onto a chart of the instrument you wish to trade.</p>
<p>10. Upon prompting, click on the 'Inputs' tab to set your parameters, such as initial capital and maximum loss.</p>
<p>11. Click 'OK' to activate Risk Bot on your terminal.</p>

With Risk Bot now installed and operational, you can trade with the assurance that your downside is capped, helping you stick to your trading plan and safeguard your investments. Happy trading, and may your risks always be managed and your rewards ample!

        </div>
        </div>
        </div>
    )
}