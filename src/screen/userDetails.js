import React, { useEffect, useRef, useState } from "react";
import circle from "../images/online.webp";
import setting from "../images/setting.webp";
import left from "../images/Leftarrow.webp";
import right from "../images/Rightarrow.webp";
import circleDot from "../images/CircleDot.webp";
import line from "../images/line.webp";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import leftArrow from "../images/left-arrow.png"
import rightArrow from "../images/right-arrow.png"
import CircularProgressBar from "./component/circularProgressBar";
import activityImage from "../images/activity-level.svg"
import needle from '../images/Needle.svg'
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import useLoading from "../hooks/useLoading";
import axios from "axios";
import logo from '../images/app-logo-white.svg'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Pusher from 'pusher-js';
import DeleteSSModal from "./component/deleteSSModal";
import deleteIcon from '../images/delete.svg'
import { enqueueSnackbar, SnackbarProvider } from 'notistack'
import BackToTop from "./component/backToTop";
import Modal from 'react-bootstrap/Modal';
import perc_20 from "../images/Red.svg"
import perc_40 from "../images/Orange.svg"
import perc_60 from "../images/Yellow.svg"
import perc_80 from "../images/LightGreen.svg"
import perc_100 from "../images/FullGreen.svg"
import { ImCross } from "react-icons/im";
import edit from '../images/EditTimeZone.webp';
import { CaptureScreenshot } from "./component/captureScreenshot";

function UserDetails() {

    const [rotation, setRotation] = useState(0)
    const [lastScreenshot, setLastScreenshot] = useState(null)
    const { loading, setLoading } = useLoading()
    const [data, setData] = useState([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [ssData, setSSData] = useState(null);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const formatTime = (hour) => {
        const formattedHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour < 12 ? 'AM' : 'PM';
        return `${formattedHour.toString().padStart(2, '0')}:00 ${period}`;
    };
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeButton, setActiveButton] = useState(null);
    const location = useLocation();
    const items = JSON.parse(localStorage.getItem('items'));
    const [timeBill, setTimeBill] = useState({});
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const today = new Date().getFullYear();
    const [clickDay, setClickDay] = useState()
    const [month, setMonth] = useState()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [timeEntryId, setTimeEntryId] = useState(null)
    const [showScrollButton, setShowScrollButton] = useState(false)
    const [editModalContent, setEditModalContent] = useState(null)
    const [splitTime, setSplitTime] = useState(null)

    const [trimActivity, setTrimActivity] = useState(null)
    const [screenshotId, setScreenshotId] = useState(null)
    const [showSplitActivity, setShowSplitActivity] = useState(false)
    const [showTrimActivity, setShowTrimActivity] = useState(false)
    const [showOfflineTime, setShowOfflineTime] = useState(false)
    const [showDeleteButton, setShowDeleteButton] = useState(false)
    const [showEditButton, setShowEditButton] = useState(false)

    const [timeEntries, setTimeEntries] = useState([]);
    const [offiineTiming, setOfflineTiming] = useState(false);
    const [splitActivity, setSplitActivity] = useState(false);
    const [changeEdit, setEdit] = useState(false);

    const userId = items?._id;
    const currentMonths = (new Date().getMonth() + 1).toString().padStart(2, '0');
    const currentDate = new Date().getDate().toString().padStart(2, '0');
    const todayDate = `${today}-${currentMonths}-${currentDate}`;
    const [formattedDate, setFormattedDate] = useState(todayDate);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];
    const months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDay();

    const apiUrl = "https://combative-fox-jumpsuit.cyclic.app/api/v1";
    let token = localStorage.getItem('token');
    let headers = {
        Authorization: 'Bearer ' + token,
    }
    let startsTime;
    let endsTime;

    const navigate = useNavigate("")

    const prevMonth = () => {
        setDate((prevDate) => {
            const prevMonthDate = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1);
            return prevMonthDate;
        });
    };

    const nextMonth = () => {
        setDate((prevDate) => {
            const nextMonthDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1);
            return nextMonthDate;
        });
    };

    const goBackToPreviousImage = () => {
        if (selectedImageIndex >= 0) {
            setSelectedImageIndex(selectedImageIndex - 1)
        }
        else {
            setSelectedImage(null);
            setSelectedImageIndex(null)
            setSSData(null)
        }
    };

    const goToNextImage = () => {
        if (selectedImageIndex < ssData?.screenshots?.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1)
        }
        else {
            setSelectedImage(null);
            setSelectedImageIndex(null)
            setSSData(null)
        }
    };

    const openModal = (element, imageSrc, index) => {
        setSelectedImage(imageSrc);
        setSelectedImageIndex(index)
        setSSData(element)
        console.log(index);
    };

    const renderCalendar = () => {
        const month = date.getMonth();
        const year = date.getFullYear();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const weeks = [];
        let days = [];
        let currentDay = new Date(firstDayOfMonth);

        const handleClick = (key) => {
            setSelectedDate(key);
            const clickDay = new Date(key).getFullYear();
            const clickMonth = (new Date(key).getMonth() + 1).toString().padStart(2, '0');
            const clickDate = new Date(key).getDate().toString().padStart(2, '0');
            const formattedsDate = `${clickDay}-${clickMonth}-${clickDate}`;
            setFormattedDate(formattedsDate);
            setActiveButton(key)
            const clickDa = new Date(key).getDay();
            const clickMon = new Date(key).getMonth();
            // console.log(clickDa);
            setClickDay(clickDa)
            setMonth(clickMon)
            // console.log(formattedDate)
        };

        // Generate cells for each day in the current month
        for (let i = 1; i <= daysInMonth; i++) {
            const isWeekend = currentDay.getDay() === 0 || currentDay.getDay() === 6;
            const isFirstDayOfWeek = currentDay.getDay() === 1;
            const isLastDayOfWeek = currentDay.getDay() === 0 || i === daysInMonth;
            const dayKey = currentDay.toString(); // Generate a unique key using the string representation of the date
            const isCurrentDate = currentDay.getDate() === new Date().getDate() && currentDay.getMonth() === new Date().getMonth();

            days.push(
                <div
                    style={{ cursor: "pointer" }}
                    className={`col cell ${isWeekend ? "week day week first" : "day"} ${dayKey === activeButton ? "active" : isCurrentDate ? "active2" : ""}`}
                    key={dayKey}
                    onClick={() => handleClick(dayKey)}
                >
                    <p className="weekName">{currentDay.toLocaleString("en-US", { weekday: "short" })}</p>
                    <p className="Weekdate">{currentDay.getDate()}</p>
                    <p className="nonetaken">{currentDay.toLocaleString("en-US", { weekday: "short" })}</p>
                </div>
            );
            currentDay.setDate(currentDay.getDate() + 1);
        }

        weeks.push(<div className="days" key={currentDay}>{days}</div>);
        return weeks;
    };

    const fetchData = async () => {
        try {
            const response = await axios.get(`${apiUrl}/timetrack/sorted-screenshot?date=${encodeURIComponent(formattedDate)}`, { headers });
            setLoading(true)
            if (response.data) {
                setTimeout(() => {
                    setLoading(false)
                }, 100);
                setData(response.data.data);
                setTimeEntryId(response.data.data.TimeTrackingId)
                setTimeEntries(response?.data?.data?.groupedScreenshots || []);
                setTrimActivity({ ...trimActivity, totalHours: response?.data?.data?.totalHours.daily })
                console.log(response);
            }
        }
        catch (error) {
            setTimeout(() => {
                setLoading(false)
            }, 100);
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [formattedDate]);

    const closeModal = () => {
        setSelectedImage(null);
        setSSData(null)
        setSelectedImageIndex(null)
    };

    useEffect(() => {
        if (selectedImageIndex) {
            setSelectedImage(ssData?.screenshots[selectedImageIndex]?.key)
        }
        if (selectedImageIndex === 0) {
            setSelectedImage(ssData?.screenshots[0]?.key)
        }
    }, [selectedImageIndex])

    useEffect(() => {
        const keyPressHandler = (event) => {
            if (event.key === 'ArrowLeft') {
                console.log(event);
                goBackToPreviousImage();
            }
            else if (event.key === 'ArrowRight') {
                console.log(event);
                goToNextImage();
            }
            else if (event.key === 'Escape') {
                setSelectedImage(null);
                setSSData(null)
                setSelectedImageIndex(null)
            }
        }
        window.addEventListener('keydown', keyPressHandler);
        return () => window.removeEventListener('keydown', keyPressHandler);
    }, [selectedImageIndex]);

    // const datalength = data?.groupedScreenshots?.map((e) => e?.screenshots.length)

    // const timeRanges = data?.groupedScreenshots?.map((e) => {
    //     const [startTime, endTime] = e?.time?.split(' - ');
    //     return {
    //         startHour: parseInt(startTime?.split(':')[0], 10),
    //         endHour: parseInt(endTime?.split(':')[0], 10),
    //     };
    // });

    const renderTimeIntervals = () => {
        const intervals = [];

        for (let hour = 0; hour <= 23; hour++) {
            const isPM = hour >= 12;
            const formattedHour = hour <= 12 ? hour : hour - 12;

            intervals.push(
                <div key={hour} className="time-slot">
                    <div className="hour-color">
                        {formattedHour === 0 ? 12 : formattedHour} {isPM ? 'pm' : 'am'}
                        <div className="minute-container">
                            {Array.from({ length: 60 }, (_, minute) => {
                                const timeWithMinutes = `${hour}:${minute < 10 ? '0' + minute : minute}`;
                                const color = getColorForTime(timeWithMinutes);

                                return (
                                    <div
                                        key={minute}
                                        className={`time-interval ${color !== 'transparent' ? 'red' : ''}`}
                                        style={{ background: color }}
                                    >
                                        {minute}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            );
        }

        return intervals;
    };

    const getColorForTime = (time) => {
        const matchingEntry = timeEntries.find(entry => {
            const [startTime, endTime] = entry?.time?.split(' - ');
            const startTimeFormatted = new Date(`${encodeURIComponent(formattedDate)} ${startTime}`).getTime();
            const endTimeFormatted = new Date(`${encodeURIComponent(formattedDate)} ${endTime}`).getTime();
            const currentTimeFormatted = new Date(`${encodeURIComponent(formattedDate)} ${time}`).getTime();
            return currentTimeFormatted >= startTimeFormatted && currentTimeFormatted <= endTimeFormatted;
        });
        return matchingEntry ? "#A8C96A" : '#EFF9EC';
    };

    // var pusher = new Pusher('334425b3c859ed2f1d2b', {
    //     cluster: 'ap2'
    // });

    // var channel = pusher.subscribe('ss-track');

    // channel.bind('my-user', function (data) {
    //     console.log(data.data);
    // });

    // useEffect(() => {
    //     var channel = pusher.subscribe('ss-track');
    //     channel.bind("new-ss", (data) => {
    //         setLastScreenshot(data?.data)
    //         setData((prevData) => {
    //             return {
    //                 ...prevData,
    //                 groupedScreenshots: prevData?.groupedScreenshots?.map((groupeScreenshot) => {
    //                     if (data?.data?.timeEntryId === groupeScreenshot?.timeentryId) {
    //                         return {
    //                             ...groupeScreenshot,
    //                             screenshots: [...groupeScreenshot?.screenshots, data?.data]
    //                         }
    //                     }
    //                     else {
    //                         return groupeScreenshot
    //                     }
    //                 })
    //             }
    //         })
    //         console.log("new ss ===>", data);
    //     });
    //     return () => {
    //         channel.unbind("new-ss");
    //     };
    // }, []);

    // channel.bind('my-event', function (data) {
    //     console.log(JSON.stringify(data));
    // });

    const handleOpenDeleteModal = (element, elements) => {
        setShowDeleteModal(true)
        setScreenshotId(elements._id)
    }

    const handleDeleteSS = async () => {
        setShowDeleteModal(false)
        try {
            const response = await axios.delete(`${apiUrl}/timetrack/deleteScreenshot/${screenshotId}/TimeTracking/${timeEntryId}`, {
                headers: headers
            })
            if (response.status === 200) {
                console.log(response);
                enqueueSnackbar("Screenshot deleted", {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
            }
            fetchData()
        } catch (error) {
            console.log(error);
            enqueueSnackbar("network error", {
                variant: "error",
                anchorOrigin: {
                    vertical: "top",
                    horizontal: "right"
                }
            })
        }
    }

    const handleSplitActivity = async () => {
        setShowSplitActivity(false)
        setShowTrimActivity(false)
        setShowOfflineTime(false)
        try {
            const response = await axios.post(`${apiUrl}/superAdmin/split-activity`, {
                timeEntryId: trimActivity?.timeentryId,
                userId: userId,
                splitTime: formattedDate + " " + splitTime?.splitTime
            }, {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            if (response.status === 200) {
                enqueueSnackbar(response.data.message, {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right"
                    }
                })
                fetchData()
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setRotation(rotation + 1)
        }, 10);
        if (rotation >= 190) {
            setRotation(0)
        }
        return () => clearInterval(timer)
    }, [rotation])

    useEffect(() => {
        document.addEventListener("scroll", () => {
            if (window.scrollY > 10) {
                setShowScrollButton(true)
            }
            else {
                setShowScrollButton(false)
            }
        })
    }, [])
    
    return (
        <div>

            {showScrollButton === true ? <BackToTop /> : null}

            {showDeleteModal ? <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} animation={true} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Delete screenshot</p>
                    <p>Are you sure want to delete this screenshot? This will also cut time from your timeline.</p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={handleDeleteSS}>
                        DELETE
                    </button>
                    <button className="teamActionButton" onClick={() => setShowDeleteModal(false)}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}

            {/* {showTrimActivity ? <Modal show={showTrimActivity} onHide={() => {
                setShowOfflineTime(true)
                setShowTrimActivity(false)
                setShowSplitActivity(false)
            }} animation={true} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Edit time</p>
                    <div className="editBoxLowerDiv">
                        <p>You can trim activity time, or edit activity note. <br />
                            If you need add time, then <a onClick={() => {
                                setShowOfflineTime(true)
                                setShowTrimActivity(false)
                                setShowSplitActivity(false)
                            }}>Add Offline Time </a> instead
                        </p>
                        <div className="editboxinputdiv">
                            <input onChange={(e) => setTrimActivity({ ...trimActivity, startTime: e.target.value })} value={trimActivity?.startTime} />
                            -
                            <input onChange={(e) => setTrimActivity({ ...trimActivity, endTime: e.target.value })} value={trimActivity?.endTime} />
                            <p>-{trimActivity?.totalHours ? trimActivity?.totalHours : "0h 0m"}</p>
                        </div>
                        <p className="sevenAm">eg 7am to 9:10am or 17:30 to 22:00</p>
                        <div>
                            <select className="projectOption" defaultValue="">
                                <option>Infiniti Solutions</option>
                                <option>Y8HR</option>
                                <option>Peel HR</option>
                                <option>Geox HR</option>
                                <option>Click HR</option>
                            </select>
                        </div>
                        <textarea placeholder="Note (optional)" rows="5" ></textarea>
                        <div className="deleteActivityPart">
                            <div style={{ cursor: "pointer" }}>
                                <input id="editcheck" type="checkbox" />
                                <p style={{ margin: 0, padding: 0 }}>Delete this activity</p>
                            </div>
                            <a href="#" onClick={() => {
                                setShowSplitActivity(true)
                                setShowTrimActivity(false)
                            }}>Split Activity</a>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton">
                        SAVE CHANGES
                    </button>
                    <button className="teamActionButton" onClick={() => {
                        setShowOfflineTime(false)
                        setShowTrimActivity(false)
                        setShowSplitActivity(false)
                    }}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null} */}

            {showSplitActivity ? <Modal show={showSplitActivity} onHide={() => {
                setShowSplitActivity(false)
                setShowTrimActivity(false)
                setShowOfflineTime(false)
            }} animation={true} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Edit time</p>
                    <div className="editBoxLowerDiv">
                        <div className="editboxinputdiv">
                            <input placeholder="9:05" />-<input placeholder="split" />-<input placeholder="10:00" /> <p>-0h 40m</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton" onClick={handleSplitActivity}>
                        SAVE CHANGES
                    </button>
                    <button className="teamActionButton" onClick={() => {
                        setShowSplitActivity(false)
                        setShowTrimActivity(false)
                        setShowOfflineTime(false)
                    }}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null}

            {/* {showOfflineTime ? <Modal show={showOfflineTime} onHide={() => {
                setShowOfflineTime(false)
                setShowSplitActivity(false)
                setShowTrimActivity(false)
            }} animation={true} centered>
                <Modal.Body>
                    <p style={{ marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Add Offline Time</p>
                    <div className="editBoxLowerDiv">
                        <p>Offline time range will appear on your timeline <br />
                            You will able to edit or delete from there
                        </p>
                        <div className="editboxinputdiv">
                            <input placeholder="From" />-<input placeholder="To" /> <p>-0h 40m</p>
                        </div>
                        <p className="sevenAm">eg 7am to 9:10am or 17:30 to 22:00</p>
                        <div>
                            <select className="projectOption">
                                <option>Infiniti solution</option>
                                <option>Infiniti solution</option>
                                <option>Infiniti solution</option>
                                <option>Infiniti solution</option>
                                <option>Infiniti solution</option>
                            </select>
                        </div>
                        <textarea placeholder="Note (optional)" rows="5" ></textarea>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="teamActionButton">
                        SAVE CHANGES
                    </button>
                    <button className="teamActionButton" onClick={() => {
                        setShowOfflineTime(false)
                        setShowSplitActivity(false)
                        setShowTrimActivity(false)
                    }}>
                        CANCEL
                    </button>
                </Modal.Footer>
            </Modal> : null} */}

            <SnackbarProvider />
            <div className="container">
                <div className="mainwrapper">
                    <div className="userHeader">
                        <div className="headerTop">
                            <h5><img src={circle} alt="" /> {data?.name}</h5>
                        </div>
                        <div className="headerTop">
                            <p>{data?.timezone}</p>
                            <img src={setting} alt="setting.png" style={{ cursor: "pointer" }} onClick={() => navigate("/account")} />
                        </div>
                    </div>
                    <div className="userMainContent">
                        <div>
                            <div className="calendar-container">
                                <div className="header">
                                    <img src={left} onClick={prevMonth} alt="Previous Month" />
                                    <h2 className="monthName">{date.toLocaleString("en-US", { month: "long" })}</h2>
                                    <img src={right} onClick={nextMonth} alt="Next Month" />
                                </div>
                            </div>
                            <div className="days-weeks">{renderCalendar()}</div>
                            <div className="timerAndTracking">
                                <div style={{ margin: "0 10px 0 0" }} className="timerLeft">
                                    <div>
                                        <img width={120} src={logo} alt="" />
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                                        <p className="weekDayTimer">{formattedDate == todayDate ? days[currentDay] : days[clickDay]} </p>
                                        <p className="weekDayTimer">{formattedDate && formattedDate.split('-')[2]}</p>
                                        <p className="weekDateTimer">{formattedDate == todayDate ? months[currentMonth] : months[month]}</p>
                                        <OverlayTrigger placement="top" overlay={<Tooltip>{Math.floor(data?.totalactivity)} %</Tooltip>}>
                                            <div className="circular-progress" style={{
                                                cursor: "pointer"
                                            }}>
                                                <CircularProgressBar activityPercentage={data?.totalactivity} size={30} />
                                            </div>
                                        </OverlayTrigger>
                                        <p className="timerClock">{data?.totalHours?.daily}</p>
                                        <p className="weekTimer">Week</p>
                                        <p className="weekTimerDigit">{data?.totalHours?.weekly}</p>
                                        <img src={circleDot} alt="CircleDot.png" />
                                        <p className="weekTimer">Month</p>
                                        <p className="monthTimerDigit">{data?.totalHours?.monthly}</p>
                                    </div>
                                </div>
                                <div className="activity-image-container">
                                    <div className="activityMainHeading">
                                        <h4 className="activityMainHeadingContent">Activity Tracker</h4>
                                        <p className="activityMainContent">Activity Level</p>
                                    </div>
                                    <div className="activityMeternContent">
                                        <div className="activityMeterContentMain">
                                            <div className="activityMeterContent">
                                                <img src={perc_20} alt="" />
                                                <p className="activityMeterContentPercent">0 - 20 %</p>
                                            </div>
                                            <div className="activityMeterContent">
                                                <img src={perc_40} alt="" />
                                                <p className="activityMeterContentPercent">21 - 40 %</p>
                                            </div>
                                            <div className="activityMeterContent">
                                                <img src={perc_60} alt="" />
                                                <p className="activityMeterContentPercent">41 - 60 %</p>
                                            </div>
                                            <div className="activityMeterContent">
                                                <img src={perc_80} alt="" />
                                                <p className="activityMeterContentPercent">61 - 80 %</p>
                                            </div>
                                            <div className="activityMeterContent">
                                                <img src={perc_100} alt="" />
                                                <p className="activityMeterContentPercent">81 - 100 %</p>
                                            </div>
                                        </div>
                                        <div className="activityMeterMain">
                                            <div className="activityMeterMainContainer">
                                                <img className="activityMeterMainImage" src={activityImage} alt="" />
                                                <div className="needleContainerMain">
                                                    <div
                                                        className="needleContainerMainAlingment"
                                                        style={{
                                                            transform: `translateY(-50%) rotate(${Math.floor(data?.totalactivity) <= 20 ? -75 :
                                                                Math.floor(data?.totalactivity) > 20 && Math.floor(data?.totalactivity) <= 40 ? -38 :
                                                                    Math.floor(data?.totalactivity) > 40 && Math.floor(data?.totalactivity) <= 60 ? 0 :
                                                                        Math.floor(data?.totalactivity) > 60 && Math.floor(data?.totalactivity) <= 80 ? 35 :
                                                                            Math.floor(data?.totalactivity) > 80 ? 75 : -108
                                                                }deg)`
                                                        }}>
                                                        <div className="needleContainerAlingment">
                                                            <div className="diamond"></div>
                                                            <div className="needlePointerMain"></div>
                                                            <OverlayTrigger placement="bottom" overlay={<Tooltip>{Math.floor(data?.totalactivity)} %</Tooltip>}>
                                                                <div className="needleScrewMain"></div>
                                                            </OverlayTrigger>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="timerAndTracking">
                                <div style={{ margin: "0 10px 0 0" }} className="timerLeft">
                                    <div>
                                        <img width={120} src={logo} alt="" />
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                                        <p className="weekDayTimer">{formattedDate == todayDate ? days[currentDay] : days[clickDay]} </p>
                                        <p className="weekDayTimer">{formattedDate && formattedDate.split('-')[2]}</p>
                                        <p className="weekDateTimer">{formattedDate == todayDate ? months[currentMonth] : months[month]}</p>
                                        <OverlayTrigger placement="top" overlay={<Tooltip>{Math.floor(data?.totalactivity)} %</Tooltip>}>
                                            <div className="circular-progress" style={{
                                                cursor: "pointer"
                                            }}>
                                                <CircularProgressBar activityPercentage={data?.totalactivity} size={30} />
                                            </div>
                                        </OverlayTrigger>
                                        <p className="timerClock">{data?.totalHours?.daily}</p>
                                        <p className="weekTimer">Week</p>
                                        <p className="weekTimerDigit">{data?.totalHours?.weekly}</p>
                                        <img src={circleDot} alt="CircleDot.png" />
                                        <p className="weekTimer">Month</p>
                                        <p className="monthTimerDigit">{data?.totalHours?.monthly}</p>
                                    </div>
                                </div>
                                <div className="activity-image-container" style={{ margin: "0 0 0 10px" }}>
                                    <div className="needle-container">
                                        <div className="needle"></div>
                                        <div className="dot"></div>
                                    </div>
                                    <img className="activity-image" src={activityImage} alt="" />
                                </div>
                            </div> */}
                            <div className="time-scale" style={{ display: "flex" }}>
                                {renderTimeIntervals()}
                            </div>

                            <div>

                                {data && (data?.groupedScreenshots?.map((element) => {
                                    return (
                                        <div>
                                            {loading ? <Skeleton count={1} width="300px" height="34.5px" style={{ margin: "40px 0 0 0" }} /> : <div className="timeZone" onMouseOver={() => setShowEditButton(true)} onMouseOut={() => setShowEditButton(false)}>
                                                <p className="timeDuration">{element.time}</p>
                                                <OverlayTrigger placement="top" overlay={<Tooltip>{Math.floor(element?.totalactivity)} %</Tooltip>}>
                                                    <div className="circular-progress" style={{ margin: "0 20px", cursor: "pointer" }}>
                                                        <CircularProgressBar activityPercentage={element?.totalactivity} size={30} />
                                                    </div>
                                                </OverlayTrigger>
                                                {showEditButton && <img onClick={() => {
                                                    setShowTrimActivity(true)
                                                    setSplitTime({
                                                        ...splitTime,
                                                        timeentryId: element.timeentryId,
                                                        startTime: element.time.split(" ")[0] + " " + element.time.split(" ")[1],
                                                        endTime: element.time.split(" ")[3] + " " + element.time.split(" ")[4]
                                                    })
                                                }} src={edit} alt="EditTimeZone.png" style={{ cursor: "pointer" }} />}
                                            </div>}
                                            <div style={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                                                gap: "20px",
                                            }}>
                                                {element?.screenshots && (element?.screenshots?.map((elements, index) => {
                                                    return loading ? (
                                                        <Skeleton count={1} width="364px" height="248.44px" style={{ margin: "20px 0 12px 0" }} />
                                                    ) : (
                                                        <div className="projectAdd" onMouseOver={() => setShowDeleteButton(true)} onMouseOut={() => setShowDeleteButton(false)}>
                                                            <div className="timelineDiv">
                                                                <p className="notes">
                                                                    {elements?.time}
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>{elements?.description}</Tooltip>}>
                                                                        <a className="websiteLink" href="#">{elements?.description}</a>
                                                                    </OverlayTrigger>
                                                                </p>
                                                                <img src={deleteIcon} alt="" style={{ marginRight: 15 }} onClick={() => handleOpenDeleteModal(element, elements)} />
                                                                {elements?.visitedUrls?.length === 0 ?
                                                                    <OverlayTrigger placement="top" overlay={<Tooltip>0 %</Tooltip>}>
                                                                        <div className="circular-progress">
                                                                            <CircularProgressBar activityPercentage={100} size={30} emptyUrl={0} />
                                                                        </div>
                                                                    </OverlayTrigger>
                                                                    :
                                                                    elements?.visitedUrls?.map((e) => {
                                                                        return e?.activityPercentage === 0 ? (
                                                                            <OverlayTrigger placement="top" overlay={<Tooltip>0 %</Tooltip>}>
                                                                                <div className="circular-progress">
                                                                                    <CircularProgressBar activityPercentage={100} size={30} emptyUrl={0} />
                                                                                </div>
                                                                            </OverlayTrigger>
                                                                        ) : (
                                                                            <OverlayTrigger placement="top" overlay={<Tooltip>{Math.floor(e?.activityPercentage)} %</Tooltip>}>
                                                                                <div className="circular-progress">
                                                                                    <CircularProgressBar activityPercentage={e?.activityPercentage} size={30} />
                                                                                </div>
                                                                            </OverlayTrigger>
                                                                        )
                                                                    })}
                                                            </div>
                                                            <div className="screenShotImg">
                                                                <img className="screenshotiimage" onClick={() => openModal(element, elements?.key, index)} src={elements?.key} alt="ScreenShotImg.png" />
                                                            </div>
                                                        </div>
                                                    )
                                                }))}

                                                {selectedImage && (
                                                    <div className="fullscreen-screenshot-model">
                                                        <div style={{ margin: "20px 20px 0 20px", textAlign: "right" }}>
                                                            <ImCross size={20} color="white" onClick={closeModal} />
                                                        </div>
                                                        <div className="ss-image">
                                                            <div className="d-flex align-items-center gap-5">
                                                                <div
                                                                    onClick={() => {
                                                                        goBackToPreviousImage(element.screenshots)
                                                                    }}>
                                                                    <img width={40} src={leftArrow} />
                                                                </div>
                                                                <div>
                                                                    <img className="modalImage" src={selectedImage} alt="Pop-up Image" />
                                                                </div>
                                                                <div
                                                                    onClick={() => {
                                                                        goToNextImage(element.screenshots)
                                                                    }}>
                                                                    <img width={40} src={rightArrow} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                }))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <img className="userDetailLine" src={line} />
        </div>
    )
}

export default UserDetails;