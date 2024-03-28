import React, { useEffect, useState } from "react";
import Logo from '../images/legodi_logo.jpg';
import GeofenceImage from '../images/cow.jpg';
import news1 from '../images/pic1.jpg';
import news2 from '../images/pic2.jpg';
import news3 from '../images/pic3.jpg';
import aboutImage from '../images/feedbck.jpg'


export default function Legodi() {
    return (
        <div className="legodi-body">
            <div className="legodi-hero-section">
            <br /><br />
            <div className="upper-nav-legodi">
                <div className="legodi-logo-and-title">
                    <img src={Logo} alt="logo" className="legodi-logo" />
                    {/* <h4>LEGODI Future Technologies</h4> */}
                </div>
                <div className="upper-nav-legodi-right">
                    <h6>Home</h6>
                    <h6>Blog</h6>
                    <h6>Book Online</h6>
                <h6>Contact Us</h6>
                </div>
            </div><br /><br /><br /><br />

            <div className="transforming-agriculture-div">
                <h1>Transforming Agriculture</h1><br />
                {/* <img src={GeofenceImage} alt="legodi-geofence-image" className="legodi-geofence-image" /> */}
                <div className="legodi-innovative-technology-div">
                    <h4>with Innovative Technology</h4><br />
                    <div className="legodi-innovative-technology-div-text">
                        <h6>
                            We provide South African farmers with cutting-edge ear tags and tracking devices to
                            monitor livestock. Discover our innovative solutions designed to transform the way you deal 
                            with agriculture.
                        </h6>
                    </div><br />
                    <button className="btn btn-primary">Contact Us</button><br /><br />
                </div>
                </div>
                <br /><br /><br /><br />
            </div>

            <div className="legodi-about-section-div">
            <br />
            <img src={GeofenceImage} alt="logo" className="legodi-about-image" />
                <div className="legodi-about-section-div-contents">
                    <div className="legodi-about-section-explanation">
                        <h1>Our Vision</h1><br /><br />
                        <p>At LEGODI Future Technologies, we are revolutionizing the Agritech industry by 
                            leveraging cutting-edge technology to enhance livestock management. Our innovative solutions, 
                            such as ear tags and geofencing, enable farmers to track and monitor their livestock with ease. 
                            With our advanced systems, farmers can optimize their operations, improve animal welfare, 
                            and increase productivity.
                            Join us on our mission to transform the future of agriculture.</p>
                            <div className="legodi-social-media-icons">
                                <i className="bi bi-facebook" /><i className="bi bi-twitter" /><i className="bi bi-linkedin" /><i className="bi bi-instagram" />
                            </div>
                            <br /><br />
                            <button className="btn btn-primary">Learn More</button>
                    </div>
                    
                </div>
            </div>

            <div className="legodi-our-services-div">
            
                <div className="legodi-our-services-div-contents">
                    <h1>Our Services</h1><br /><br /><br />
                    <div className="legodi-offered-services">
                        <div className="s1">
                            <h5>Service 1</h5>
                            <hr /><br />
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vehicula massa at nisi rutrum, vel lacinia
                                 nulla pretium. Nam hendrerit diam et libero interdum, a gravida quam 
                                 condimentum. Nulla facilisi. Duis ac libero eget lectus lacinia aliquet 
                                 nec at magna. </p>
                            <p>US$80</p>
                            <button className="btn btn-primary">BOOK NOW</button>
                        </div><br />
                        <div className="s2">
                            <h5>Service 2</h5>
                            <hr /><br />
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vehicula massa at nisi rutrum, vel lacinia
                                 nulla pretium. Nam hendrerit diam et libero interdum, a gravida quam 
                                 condimentum. Nulla facilisi. Duis ac libero eget lectus lacinia aliquet 
                                 nec at magna. </p>
                            <p>US$60</p>
                            <button className="btn btn-primary">BOOK NOW</button>
                            {/* <br /> */}
                        </div><br />
                        <div className="s3">
                            <h5>Service 3</h5>
                            <hr /><br />
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vehicula massa at nisi rutrum, vel lacinia
                                 nulla pretium. Nam hendrerit diam et libero interdum, a gravida quam 
                                 condimentum. Nulla facilisi. Duis ac libero eget lectus lacinia aliquet 
                                 nec at magna. </p>
                            <p>US$35</p>
                            <button className="btn btn-primary">BOOK NOW</button>
                        </div>
                        
                    </div>
                </div>
            </div>
            

            <div className="legodi-latest-news-div">
                <div className="legodi-latest-news-div-contents">
                    <h1>Latest News</h1>
                    <br />
                    <div className="legodi-latest-news-news">
                        <div className="legodi-latest-news-pic1">
                            <img src={news1} alt="news image 1" className="news-pic1" /><br /><br />
                            <h5>Empowering South African...</h5>
                            <p>In today's rapidly evolving world, technology has become an integral part
                                of almost every industry...
                            </p>
                        </div>
                        <div className="legodi-latest-news-pic2">
                            <img src={news2} alt="news image 2" className="news-pic2" /><br /><br />
                            <h5>Revolutionizing Farming: The...</h5>
                            <p>Revolutionizing Farming: The Future Livestock Tracking in today's
                                fast-paced world, technology
                            </p>
                        </div>
                        <div className="legodi-latest-news-pic3">
                            <img src={news3} alt="news image 3" className="news-pic3" /><br /><br />
                            <h5>Enhancing Farming Efficiency With...</h5>
                            <p>
                                In today's rapidly evolving world, technology is constantly evolving
                                and revolutionizing various...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="legodi-get-in-touch-div">
                <div className="legodi-get-in-touch-contents"><br />
                    <div className="legodi-get-in-touch-header">
                        <h1>Get in Touch</h1><br />
                        {/* <h5>We would love to hear from you! If you have any questions or comments, 
                            please feel free to reach out to us. Our team is here to assist you.</h5> */}
                    </div><br /><br />
                    <div className="legodi-get-in-touch-contact-info-div">
                        <div className="legodi-contact-info">
                            <h5>Phone:</h5>
                            <b><p>123-456-7890</p></b><br />
                            <h5>Email:</h5>
                            <b><p>info@legoditech.com</p></b><br />
                            <h5>Address:</h5>
                            <b><p>123 Greenfield Road, Agritech City, 12345</p></b><br />
                        </div>
                        <div className="legodi-contact-form">
                            <h5>Send us a Message:</h5><br />
                            <form>
                            <div class="row">
                                <div class="col">
                                    <label>First Name</label>
                                <input type="text" class="form-control" placeholder="First name" />
                                </div>
                                <div class="col">
                                    <label>Last Name</label>
                                <input type="text" class="form-control" placeholder="Last name" /><br />
                                
                                </div>
                            </div>
                            </form>
                            <label>Email *</label>
                            <input type="email" className="form-control" /><br />
                            <div class="form-group">
                                <label for="exampleFormControlTextarea1">Message</label>
                                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                            </div><br />
                            <button className="btn btn-primary">Send</button>
                            
                        </div>
                        
                    </div><br />
                    <b><p>Stay informed, <br />join our newsletter</p></b><br />
                    <b><p>Enter your email here *</p></b>
                    {/* <label>Email*<//> */}
                    <div className="legodi-footer-email-input">
                    <input type="email" className="form-control" />
                    </div><br />
                    <button className="btn btn-primary">Submit</button><br /><br />
                </div>
            </div>
            
        </div>
    )
}