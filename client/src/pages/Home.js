import '../styles/Home.css'
import { Link } from 'react-router-dom'
import image1 from '../images/Sp-m1-min.png'
import image2 from '../images/bio-link-1-1024x684.png'
import image3 from '../images/short-link-2-1.png'
import image4 from '../images/qr-code-1.png'
import image5 from '../images/analytics-1.png'

import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from 'axios'
import api from '../utils/api'
import QRCode from "react-qr-code";
import ApexCharts from 'apexcharts'
import Chart from "react-apexcharts";
import { useState, useEffect } from 'react';
var CountryLanguage = require('country-language');

const Home = () => {
    const [popup, setPopup] = useState(false)
    const [originLink, setOriginLink] = useState('')
    const [shortenLink, setShortenLink] = useState('')
    const [Country, setCountry] = useState('')
    const [Language, setLanguage] = useState('')
    const [Browser, setBrowser] = useState('')
    const [Device, setDevice] = useState('')
    const [TimeOnPage, setTimeOnPage] = useState('')
    const [TimeOnPage_, setTimeOnPage_] = useState('')
    const [ButtonText, setButtonText] = useState('Trynow')
    const [Copybutton, setCopybutton] = useState('Copy')
    const [StartButton, setStartButton] = useState('Start')
    const [Indicators, setIndicators] = useState([])
    const [series_language, setSeries_language] = useState([])
    const [options_language, setOptions_language] = useState({})
    const [series_browser, setSeries_browser] = useState([])
    const [options_browser, setOptions_browser] = useState({})
    const [series_device, setSeries_device] = useState([])
    const [options_device, setOptions_device] = useState({})
    const [series_timeonpage, setSeries_timeonpage] = useState([])
    const [options_timeonpage, setOptions_timeonpage] = useState({})
    const [series_country, setSeries_country] = useState([])
    const [options_country, setOptions_country] = useState({})
    const [series_today, setSeries_today] = useState([])
    const [options_today, setOptions_today] = useState({})
    const [shortenLinkCounts, setShortenLinkCounts] = useState(0)
    const [indicatorCounts, setIndicatorCounts] = useState(0)
    const [userCounts, setuserCounts] = useState(0)

    const getData = async () => {
        const res = await axios.get('https://geolocation-db.com/json/')
        setCountry(res.data.country_name)
        CountryLanguage.getCountryLanguages(res.data.country_code, function (err, languages) {
            if (err) {
                console.log(err);
            } else {
                languages.forEach(function (languageCodes) {
                    const languageNames = new Intl.DisplayNames(['en'], {
                        type: 'language'
                    });
                    // console.log(languageNames.of(languageCodes.iso639_1))
                    setLanguage(languageNames.of(languageCodes.iso639_1))
                });
            }
        });
        var browserName = (function (agent) {
            switch (true) {
                case agent.indexOf("edge") > -1: return "MS Edge";
                case agent.indexOf("edg/") > -1: return "Edge ( chromium based)";
                case agent.indexOf("opr") > -1 && !!window.opr: return "Opera";
                case agent.indexOf("chrome") > -1 && !!window.chrome: return "Chrome";
                case agent.indexOf("trident") > -1: return "MS IE";
                case agent.indexOf("firefox") > -1: return "Mozilla Firefox";
                case agent.indexOf("safari") > -1: return "Safari";
                default: return "other";
            }
        })(window.navigator.userAgent.toLowerCase());
        setBrowser(browserName)

        var OSName = "Unknown OS";

        if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";

        if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";

        if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";

        if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";

        if (navigator.appVersion.indexOf("Android") != -1) OSName = "Android";

        if (navigator.appVersion.indexOf("iOs") != -1) OSName = "iOs";

        setDevice(OSName)
        setTimeOnPage(Math.floor((new Date() - TimeOnPage_) / 1000).toString() + 's')
    }

    const getCounts = async () => {
        setShortenLinkCounts((await api.get('/shortenLink/ShortenLinkCounts')).data)
        setIndicatorCounts((await api.get('/shortenLink/IndicatorCounts')).data)
    }

    useEffect(() => {
        setTimeOnPage_(new Date())
        initialize()
    }, [])


    const ShortenLink = async () => {
        if (ButtonText == 'Shortened!')
            return
        setButtonText('Shortened!')
        const res = await api.get('/shortenLink', { params: { data: originLink } })
        var Today = new Date();

        var text = "";
        if (!res.data) {

            var possible = "qwertyuiopasdfghjklzxcvbnm0123456789QWERTYUIOPASDFGHJKLZXCVBNM";
            for (var i = 0; i < 10; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            text = 'www.nextaap.com/' + text
            setShortenLink(text)
        }
        if (res.data)
            setShortenLink(res.data.shortenLink)

        var shortenLink = text


        const body = { originLink, shortenLink, Country, Language, Browser, Device, TimeOnPage, Today }
        await api.post('/shortenLink', body)

        const res_ = await api.get('/shortenLink', { params: { data: originLink } })

        const indicate = await api.get('/shortenLink/getIndicator', { params: { data: res_.data._id } })

        setIndicators(indicate.data);

    }

    const Analysis = () => {
        if (StartButton == 'Back') {
            setSeries_country([])
            setStartButton('Start')
            return
        }
        if (StartButton == 'Start')
            setStartButton('Back')
        let Countries = {}
        let Languages = {}
        let Browsers = {}
        let Devices = {}
        let TimeOnPages = {}
        let Todays = {}
        for (let i = 0; i < Indicators.length; i++) {
            Countries[Indicators[i].Country] == undefined ? Countries[Indicators[i].Country] = 1 : Countries[Indicators[i].Country]++
            Languages[Indicators[i].Language] == undefined ? Languages[Indicators[i].Language] = 1 : Languages[Indicators[i].Language]++
            Browsers[Indicators[i].Browser] == undefined ? Browsers[Indicators[i].Browser] = 1 : Browsers[Indicators[i].Browser]++
            Devices[Indicators[i].Device] == undefined ? Devices[Indicators[i].Device] = 1 : Devices[Indicators[i].Device]++
            TimeOnPages[Indicators[i].TimeOnPage] == undefined ? TimeOnPages[Indicators[i].TimeOnPage] = 1 : TimeOnPages[Indicators[i].TimeOnPage]++
            Todays[Indicators[i].Today] == undefined ? Todays[Indicators[i].Today] = 1 : Todays[Indicators[i].Today]++
        }


        setSeries_country(Object.values(Countries))
        setOptions_country({

            labels: Object.keys(Countries),
            legend: {
                position: 'bottom'
            },
        })
        setSeries_language(Object.values(Languages))
        setOptions_language({

            labels: Object.keys(Languages),
            legend: {
                position: 'bottom'
            },
        })
        setSeries_browser(Object.values(Browsers))
        setOptions_browser({

            labels: Object.keys(Browsers),
            legend: {
                position: 'bottom'
            },
        })
        setSeries_device(Object.values(Devices))
        setOptions_device({

            labels: Object.keys(Devices),
            legend: {
                position: 'bottom'
            },
        })
        setSeries_timeonpage(Object.values(TimeOnPages))
        setOptions_timeonpage({

            labels: Object.keys(TimeOnPages),
            legend: {
                position: 'bottom'
            },
        })
        let tempdata = [];
        for (let i = 0; i < Object.keys(Todays).length; i++) {
            tempdata.push([Object.keys(Todays)[i], Object.values(Todays)[i]])
        }
        setSeries_today([{
            data: tempdata
        }])


        setOptions_today({
            chart: {
                id: 'area-datetime',
                type: 'area',
                height: 350,
                zoom: {
                    autoScaleYaxis: true
                }
            },
            annotations: {
                yaxis: [{
                    y: 30,
                    borderColor: '#999',
                    label: {
                        show: true,
                        text: 'Support',
                        style: {
                            color: "#fff",
                            background: '#00E396'
                        }
                    }
                }],
                xaxis: [{
                    x: new Date('10 Aug 2020').getTime(),
                    borderColor: '#999',
                    yAxisIndex: 0,
                    label: {
                        show: true,
                        text: 'Rally',
                        style: {
                            color: "#fff",
                            background: '#775DD0'
                        }
                    }
                }]
            },
            dataLabels: {
                enabled: false
            },
            markers: {
                size: 0,
                style: 'hollow',
            },
            xaxis: {
                type: 'datetime',
                min: new Date('10 Mar 2020').getTime(),
                tickAmount: 6,
            },
            tooltip: {
                x: {
                    format: 'dd MMM yyyy'
                }
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.7,
                    opacityTo: 0.9,
                    stops: [0, 100]
                }
            },
        })

    }

    const OriginLink = (e) => {
        setOriginLink(e.target.value)
    }

    const initialize = () => {
        setButtonText('Trynow')
        setCopybutton('Copy')
        setStartButton('Start')
        setPopup(false)
        setOriginLink('')
        setShortenLink('')
        setIndicators([])
        setCountry('')
        setLanguage('')
        setBrowser('')
        setDevice('')
        setTimeOnPage('')
        setSeries_country([])
        setOptions_country({})
        setSeries_language([])
        setOptions_language({})
        setSeries_browser([])
        setOptions_browser({})
        setSeries_device([])
        setOptions_device({})
        setSeries_timeonpage([])
        setOptions_timeonpage({})
        setSeries_today([])
        setOptions_today({})
        getCounts()
    }

    return (
        <div className='home'>
            <div className='navbar'>
                <Link className='nexus' to="/">nexus</Link>
                <Link className='navitem' to="/">Home</Link>
                <Link className='navitem' to="/">Solutions</Link>
                <Link className='navitem' to="/">Advertisers</Link>
                <Link className='navitem' to="/">Publisher Rates</Link>
                <Link className='navitem' to="/">Blog</Link>
                <div className='loginbutton'>
                    <Link className='button' to="/">Login</Link>
                </div>
            </div>
            <div className='greenboard'>
                <div style={{ 'display': 'flex' }} >
                    <div className='simple'>
                        <div className='simple_text'>
                            Do it all, with a simple link!
                        </div>
                        <div className='simple_text_s'>
                            A powerful tool to create small links for great expressions, great freedoms, great reach.
                        </div>
                        <div className='shortenbutton'>
                            <div className='button' onClick={() => { getData(); setPopup(true) }}>Shorten Link now!</div>

                        </div>
                    </div>
                    <img src={image1} width='550'></img>
                </div>
            </div>
            <div class="popup-wrapper">
                <Popup open={popup} onClose={() => { initialize() }} >

                    <div style={{ 'position': 'absolute', 'right': '10px', 'top': '20px' }} className='hover' onClick={() => { initialize() }} >
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-x" viewBox="0 0 25 25">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </div>
                    <div style={{ 'marginTop': '15%', 'fontSize': '30px' }}>nexus</div>
                    <div style={{ 'marginTop': '1.5%', 'fontSize': '20px' }}>Do it all with a single link!</div>

                    <div style={{ 'marginTop': '12%', 'display': 'inline-flex', 'fontSize': '15px' }}>
                        <input style={{
                            'height': '40px', 'width': '500px', 'borderRadius': '15px 0px 0px 15px'
                            , 'borderColor': '#17E684', 'border': '1px solid #17E684', 'paddingLeft': '20px',
                        }} placeholder='Put your link here!' onChange={OriginLink} ></input>
                        <div className='hover try' onClick={() => ShortenLink()} style={{
                            'height': 'max-content', 'width': '100px', 'borderRadius': '0px 15px 15px 0px'
                            , 'borderColor': '#17E684', 'backgroundColor': '#17E684', 'paddingTop': '10px',
                            'paddingBottom': '13px', 'color': 'white'
                        }}>{ButtonText}</div>
                    </div>
                    {ButtonText !== 'Trynow' ?
                        (<div><div style={{ 'marginTop': '5%', 'display': 'inline-flex', 'fontSize': '15px' }}>
                            <input style={{
                                'height': '30px', 'width': '400px', 'borderRadius': '15px 0px 0px 15px'
                                , 'borderColor': '#17E684', 'border': '1px solid #17E684', 'paddingLeft': '20px',
                            }} placeholder={shortenLink} disabled ></input>
                            <div className='hover try' onClick={() => {
                                navigator.clipboard.writeText(shortenLink);
                                setCopybutton('Copied!')
                            }} style={{
                                'height': 'max-content', 'width': '100px', 'borderRadius': '0px 15px 15px 0px'
                                , 'borderColor': '#17E684', 'backgroundColor': '#17E684', 'paddingTop': '7px',
                                'paddingBottom': '7px', 'color': 'white'
                            }}>{Copybutton}</div>
                        </div>
                            <div style={{ 'marginTop': '5%', 'display': 'inline-flex', 'fontSize': '15px' }}>
                                <QRCode fgColor='#17E684' value={shortenLink} size='100' />
                                <div style={{ 'marginLeft': '30px', 'display': 'block', 'textAlign': 'left' }}><div>
                                    link shortened successfully.<br />
                                    Want more customization<br /> and analytics options?
                                </div>
                                    <div className='hover try' onClick={() => Analysis()} style={{
                                        'textAlign': 'center', 'marginTop': '10px',
                                        'height': 'max-content', 'width': '100px', 'borderRadius': '15px 15px 15px 15px'
                                        , 'borderColor': '#17E684', 'backgroundColor': '#17E684', 'paddingTop': '5px',
                                        'paddingBottom': '5px', 'color': 'white'
                                    }}>{StartButton}</div>
                                </div>
                            </div>


                            {
                                series_country.length == 0 ?
                                    (<div style={{ 'marginTop': '3%', 'display': 'inline-flex' }}>
                                        <table style={{ 'columnGap': 'none' }} >
                                            <thead>
                                                <tr>
                                                    <th>Country</th>
                                                    <th>Language</th>
                                                    <th>Browser</th>
                                                    <th>Device</th>
                                                    <th>TimeOnPage</th>
                                                </tr>
                                            </thead>
                                            <tbody >

                                                {

                                                    Indicators.map((item, i) => {
                                                        return (<tr style={
                                                            (i % 2 == 0) ?
                                                                { 'backgroundColor': '#b7e7d0' } : {}
                                                        }>
                                                            <td>{item.Country}</td>
                                                            <td>{item.Language}</td>
                                                            <td>{item.Browser}</td>
                                                            <td>{item.Device}</td>
                                                            <td>{item.TimeOnPage}</td>
                                                        </tr>)
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>) : (<div>
                                        <div style={{ 'marginTop': '3%', 'display': 'inline-flex', 'backgroundColor': '#b7e7d0' }}>
                                            <Chart options={options_today} series={series_today} width='600px' height='300px' type="area" />
                                        </div>
                                        <div style={{ 'marginTop': '3%', 'display': 'inline-flex' }}>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Country</th>
                                                        <th>Language</th>
                                                        <th>Browser</th>
                                                        <th>Device</th>
                                                        <th>TimeOnPage</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>
                                        <div style={{ 'display': 'inline-flex', 'backgroundColor': '#b7e7d0' }}>
                                            <Chart options={options_country} series={series_country} width='120px' height='300px' type="donut" />
                                            <Chart options={options_language} series={series_language} width='120px' height='300px' type="donut" />
                                            <Chart options={options_browser} series={series_browser} width='120px' height='300px' type="donut" />
                                            <Chart options={options_device} series={series_device} width='120px' height='300px' type="donut" />
                                            <Chart options={options_timeonpage} series={series_timeonpage} width='120px' height='300px' type="donut" />

                                        </div>

                                    </div>)
                            }

                        </div>) : (<div></div>)
                    }


                    <div style={
                        ButtonText == 'Trynow' ?
                            ({ 'marginTop': '250px', 'fontSize': '15px' }) :
                            ({ 'marginTop': '5%', 'marginBottom': '5%', 'fontSize': '15px' })}>© 2022 Nexus . All rights reserved</div>
                </Popup>
            </div>
            <div className='whiteboard'>
                <div className='blocks' >
                    <img src={image2} width='550'></img>
                    <div style={{ 'display': 'block', 'marginLeft': '30px', 'textAlign': 'left', 'width': '450px' }}>
                        <div>
                            <hr style={{ 'borderColor': '#17E684' }} />
                        </div>
                        <div style={{ 'color': 'gray' }}>
                            YOUR WORLD IN A SHORTLINK.
                        </div>

                        <div style={{ 'color': '#17E684', 'fontSize': '50px' }}>
                            Bioenlaces Page
                        </div>

                        <div style={{ 'color': 'black', 'fontSize': '20px' }}>
                            The only link you'll ever need.

                            Create a unique page with biolinks, easily
                            show the world your latest video, song,
                            article, recipe, tour, shop, website, social
                            media post… wherever you are online.
                        </div>
                        <div style={{ 'color': 'black' }}>
                            <ul >
                                <li>Custom colors and branding</li>
                                <li>Built-in theme editor</li>
                                <li>
                                    Multiple components out of the box</li>
                                <li>SEO settings</li>
                                <li>Password protection, sensitive content warning</li>
                            </ul>
                        </div>

                    </div>

                </div>
                <div className='blocks' >

                    <div style={{ 'display': 'block', 'marginRight': '30px', 'textAlign': 'left', 'width': '450px' }}>
                        <div>
                            <hr style={{ 'borderColor': '#17E684', }} />
                        </div>
                        <div style={{ 'color': 'gray' }}>
                            EASY, UNIQUE AND EFFICIENT
                        </div>

                        <div style={{ 'color': '#17E684', 'fontSize': '50px' }}>
                            Shortlink
                        </div>

                        <div style={{ 'color': 'black', 'fontSize': '20px' }}>
                            Yes, you can also use our service as a shortener.

                            Shorten links, all with proper analytics of your visitors.
                            Or make money with them.
                        </div>
                        <div style={{ 'color': 'black' }}>
                            <ul >
                                <li>High customization
                                    Personalize, domain, brand, description, privacy, security.</li>
                                <li>Programming and expiration date</li>
                                <li>Targeting by country, device and language</li>
                                <li>A/B rotation</li>
                                <li>Password protection, sensitive content warning</li>
                            </ul>
                        </div>

                    </div>
                    <img src={image3} width='550'></img>
                </div>
                <div className='blocks' >
                    <img src={image4} width='550'></img>
                    <div style={{ 'display': 'block', 'marginLeft': '30px', 'textAlign': 'left', 'width': '450px' }}>
                        <div>
                            <hr style={{ 'borderColor': '#17E684' }} />
                        </div>
                        <div style={{ 'color': 'gray' }}>

                            WHY MAKE THE EASY, COMPLICATED?
                        </div>

                        <div style={{ 'color': '#17E684', 'fontSize': '50px' }}>
                            QR codes
                        </div>

                        <div style={{ 'color': 'black', 'fontSize': '20px' }}>
                            Full-featured QR code generator system with easy-to-use templates.
                        </div>
                        <div style={{ 'color': 'black' }}>
                            <ul >
                                <li>Custom colors and gradients

                                </li>
                                <li>custom logo</li>
                                <li>Templates Vcard, WiFi, Calendar, Location... etc.</li>

                            </ul>
                        </div>

                    </div>

                </div>
                <div className='blocks' >

                    <div style={{ 'display': 'block', 'marginRight': '30px', 'textAlign': 'left', 'width': '450px' }}>
                        <div>
                            <hr style={{ 'borderColor': '#17E684', }} />
                        </div>
                        <div style={{ 'color': 'gray' }}>
                            ADVANCED ANALYTICS
                        </div>

                        <div style={{ 'color': '#17E684', 'fontSize': '50px' }}>
                            What is not measured, does not improve, right?
                        </div>

                        <div style={{ 'color': 'black', 'fontSize': '20px' }}>
                            Monitor your link performance with comprehensive analytics for individual links and link groups.
                        </div>
                        <div style={{ 'color': 'black' }}>
                            <ul >
                                <li>Daily follow up</li>
                                <li>
                                    real-time clicks</li>
                                <li>Super segmentation and databases</li>
                                <li>Generation of demographics
                                    We include geographic and device information, operating systems, languages, references, browser, IP and more.</li>
                                <li>PTracking pixels
                                    Tracking pixels available for Facebook, Google Analytics, Google Tag Manager, LinkedIn, Pinterest, Twitter, Quora, and TikTok.</li>
                            </ul>
                        </div>

                    </div>
                    <img src={image5} width='550'></img>
                </div>
                <div style={{ 'width': '60%', 'margin': 'auto' }}>
                    <div style={{ 'display': 'block' }}>

                        <div style={{ 'color': '#17E684', 'fontSize': '50px', 'textAlign': 'left' }}>
                            Why (choose) Nexus?
                        </div>
                        <div style={{ 'color': 'black', 'fontSize': '20px', 'textAlign': 'center' }}>
                            And why not?
                        </div>
                        <div style={{ 'marginTop': '10px', 'marginBottom': '50px', 'color': 'gray', 'textAlign': 'center' }}>
                            Professionals, Companies and thousands of other people have already done it!
                        </div>
                    </div>
                    <div style={{ 'marginBottom': '30px', 'display': 'flex' }}>
                        <div style={{ 'marginBottom': '100px', 'display': 'flex', 'color': 'black', 'width': '350px', 'margin': 'auto' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="#17E684" class="bi bi-link-45deg" viewBox="0 0 16 16">
                                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z" />
                                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z" />
                            </svg>
                            <hr style={{ 'marginLeft': '20px', 'marginRight': '20px', 'borderColor': '#17E684' }} />

                            <div style={{ 'display': 'block' }}>
                                <div style={{ 'marginBottom': '30px', 'fontSize': '30px', 'color': '#17E684', }}>{shortenLinkCounts}</div>
                                <div style={{ 'fontSize': '20px', 'color': '#17E684', }}>Short links created</div>

                            </div>
                        </div>
                        <div style={{ 'marginBottom': '100px', 'display': 'flex', 'color': 'black', 'width': '350px', 'margin': 'auto' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="#17E684" class="bi bi-mouse2-fill" viewBox="0 0 16 16">
                                <path d="M7.5.026C4.958.286 3 2.515 3 5.188V5.5h4.5V.026zm1 0V5.5H13v-.312C13 2.515 11.042.286 8.5.026zM13 6.5H3v4.313C3 13.658 5.22 16 8 16s5-2.342 5-5.188V6.5z" />
                            </svg>
                            <hr style={{ 'marginLeft': '20px', 'marginRight': '20px', 'borderColor': '#17E684' }} />


                            <div style={{ 'display': 'block' }}>
                                <div style={{ 'marginBottom': '30px', 'fontSize': '30px', 'color': '#17E684', }}>{indicatorCounts}</div>
                                <div style={{ 'fontSize': '20px', 'color': '#17E684', }}>Visits Generated</div>

                            </div>
                        </div>

                        <div style={{ 'marginBottom': '100px', 'display': 'flex', 'color': 'black', 'width': '350px', 'margin': 'auto' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="#17E684" class="bi bi-person-fill" viewBox="0 0 16 16">
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            </svg>
                            <hr style={{ 'marginLeft': '20px', 'marginRight': '20px', 'borderColor': '#17E684' }} />


                            <div style={{ 'display': 'block' }}>
                                <div style={{ 'marginBottom': '30px', 'fontSize': '30px', 'color': '#17E684', }}>{userCounts}</div>
                                <div style={{ 'fontSize': '20px', 'color': '#17E684', }}>Registered users</div>

                            </div>
                        </div>


                    </div>
                    <hr style={{ 'marginBottom': '300px', 'borderColor': '#17E684' }} />
                    <div style={{ 'display': 'inline-flex', 'marginBottom': '30px', 'color': '#17E684' }}>
                        <div style={{ 'marginRight': '30px' }}>Privacy Policy

                        </div>
                        <div style={{ 'marginRight': '30px' }}>Terms of Service</div>
                        <div style={{ 'marginRight': '500px' }}>Contact Us</div>
                        <svg style={{ 'marginRight': '10px' }} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                        </svg>
                        <svg style={{ 'marginRight': '10px' }} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-twitter" viewBox="0 0 16 16">
                            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16">
                            <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" />
                        </svg>
                    </div>
                    <hr style={{ 'marginBottom': '50px', 'borderColor': '#17E684' }} />
                    <div style={{ 'display': 'inline-flex', 'marginBottom': '30px' }}>
                        <div style={{ 'display': 'block', 'width': '400px', 'color': 'gray', 'marginRight': '400px' }}>
                            <div style={{ 'marginBottom': '30px' }}>
                                Changing the way of doing digital advertising!
                                Less intrusive and more efficient</div>
                            <div>
                                © 2022 Nexus . All rights reserved</div>
                        </div>
                        <div className='button' style={{ 'marginRight': '20px' }}><svg style={{ 'marginRight': '10px' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-stars-fill" viewBox="0 0 16 16">
                            <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
                            <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
                        </svg>Dark mode</div>


                        <div className='button'><svg style={{ 'marginRight': '10px' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-globe2" viewBox="0 0 16 16">
                            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539c.142-.384.304-.744.481-1.078a6.7 6.7 0 0 1 .597-.933A7.01 7.01 0 0 0 3.051 3.05c.362.184.763.349 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9.124 9.124 0 0 1-1.565-.667A6.964 6.964 0 0 0 1.018 7.5h2.49zm1.4-2.741a12.344 12.344 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.612 13.612 0 0 1 7.5 10.91V8.5H4.51zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696c.12.312.252.604.395.872.552 1.035 1.218 1.65 1.887 1.855V11.91c-.81.03-1.577.13-2.282.287zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964A13.36 13.36 0 0 1 3.508 8.5h-2.49a6.963 6.963 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 11.909v3.014c.67-.204 1.335-.82 1.887-1.855.143-.268.276-.56.395-.872A12.63 12.63 0 0 0 8.5 11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.982 8.5h-2.49a13.36 13.36 0 0 1-.437 3.008zM14.982 7.5a6.963 6.963 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.938.437 3.008h2.49zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 0 0 1.196-.49 7.01 7.01 0 0 0-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343a7.765 7.765 0 0 0-.395-.872C9.835 1.897 9.17 1.282 8.5 1.077V4.09c.81-.03 1.577-.13 2.282-.287z" />
                        </svg>Language</div>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home;