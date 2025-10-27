import styles from "./Mail.module.css";
import { useNavigate, BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { caxios } from '../../config/config.js';
import { useEffect, useState } from 'react';
import { Pagination } from 'antd';

const Mail = () => {

    const [mail, setMail] = useState([]);
    const [searchName, setSearchName] = useState(""); // 검색어 상태
    const [checkedList, setCheckedList] = useState([]); // 체크 상태 관리
    const [allChecked, setAllChecked] = useState(false); // 전체 체크 상태

    // 페이지 이동
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const navigate = useNavigate();



    // 메일 작성란 이동
    const handleMailWrite = () => {
        navigate("/mail/mailwrite");
    }

    const handleMailSent = () => {
        navigate("mailsent");
    }

    //받은 메일 리스트 출력
    const handleMailList = () => {
        const params = {};
        if (searchName) params.name = searchName;

        caxios.get("/mail", { params: params, withCredentials: true }).then(resp => {
            setMail(prev => resp.data);
        });
    }

    // 페이지 로딩시 리스트 출력
    useEffect(() => {
        handleMailList();
    }, []);

    // 메일 보기(클릭)
    const handleMailView = (mailItem) => {
        navigate("/mail/mailview", { state: { mail: mailItem } }); // 클릭 시 Mailview 페이지로 이동
    };

    // 메일 삭제
    const handleMailDelete = () => {
        caxios.delete("/mail", { data: { seqList: checkedList }, withCredentials: true }).then(resp => {
            setMail(prev => prev.filter(mail => !checkedList.includes(mail.seq)));
        });
        setCheckedList([]);
        setAllChecked(false);
        handleMailList();
    }

    // 전체 체크박스 선택
    const handleAllcheckbox = () => {
        if (!allChecked) {
            // 모든 체크
            setCheckedList(mail.map(contact => contact.seq));
            setAllChecked(true);
        } else {
            // 모두 해제
            setCheckedList([]);
            setAllChecked(false);
        }
    }

    // 개별 체크박스 선택
    const handleSingleCheck = (seq) => {
        if (checkedList.includes(seq)) {
            setCheckedList(checkedList.filter(id => id !== seq));
        } else {
            setCheckedList([...checkedList, seq]);
        }
    }

    // 페이징용 currentMails
    const indexOfLast = currentPage * pageSize;
    const indexOfFirst = indexOfLast - pageSize;
    const currentMails = mail.slice(indexOfFirst, indexOfLast);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setAllChecked(false);
        setCheckedList([]);
    };

    // 답장기능
    // const handleMailResponse = () => {
    //     navigate("/mail/response", { state: mail });

    // }

    const handleMailResponse = () => {
        if (checkedList.length == 1) {
            const selectedMailSeq = checkedList[0];
            const selectedMail = mail.find(m => m.seq === selectedMailSeq);

            if (!selectedMail) {
                alert("선택한 메일을 찾을 수 없습니다.");
                return;
            }

            navigate("/mail/response", { state: selectedMail });
        } else {
            alert("1개의 메일만 답장이 가능합니다.")
        }
    };


    return (<div className={styles.container} >


        {/* 메인 주소록창 */}
        <div className={styles.main}>

            {/* 메일 헤더  */}
            <div className={styles.mainHeader}>

                {/* 메일 헤더 1 */}
                <div className={styles.mainHeadertop} >
                    받은 메일 :  {mail.length}개의 메일 <br />
                    <button onClick={handleMailWrite} className={styles.createbtn}>메일쓰기</button>

                </div>

                {/* 메일 헤더 2 */}
                <div className={styles.mainHeaderbottom} >

                    {checkedList.length === 0 ? (
                        <>
                            <input type="text" placeholder="검색할 발신자 이름" style={{ width: "50%", height: "50%", borderRadius: "5px", border: "none", justifyContent: "center", fontSize: "20px" }}
                                onChange={(e) => setSearchName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { handleMailList(); } }}></input>
                            <button onClick={handleMailList} >검색</button>
                        </>) : (
                        <>
                            <button onClick={handleMailResponse} style={{ margin: "10px" }}>답장</button>
                            <button onClick={handleMailDelete} style={{ margin: "10px" }}> 삭제 </button>

                        </>
                    )}
                </div>

            </div> {/* 메일 헤더  */}


            {/* 메일 양식 */}
            <div className={styles.mainBody} style={{ fontSize: "20px", marginTop: "20px" }}>

                <div className={styles.mainBodyHeader}>
                    <div className={styles.mainBodycheckbox}><input type="checkbox" onClick={handleAllcheckbox} /></div>
                    <div className={styles.mainBodytag}>발신자</div>
                    <div className={styles.mainBodytag}>발신자 아이디</div>
                    <div className={styles.mainBodytagTitle}>제목</div>
                    <div className={styles.mainBodytag}>수신 날짜</div>
                    <br></br>

                </div>


                {/* 메일 출력  */}
                <div className={styles.mainBodylist}>
                    {currentMails.map(e =>
                        <div key={e.seq} className={styles.mainBodylistbox} >
                            <div className={styles.mainBodycheckbox}><input type="checkbox" checked={checkedList.includes(e.seq)} onChange={() => handleSingleCheck(e.seq)} /></div>
                            <div className={styles.mainBodytag} onClick={() => handleMailView(e)} >{e.senderName}</div>
                            <div className={styles.mainBodytag} onClick={() => handleMailView(e)} >{e.senderId}</div>
                            <div className={styles.mainBodytagTitle} onClick={() => handleMailView(e)} >{e.title}</div>
                            <div className={styles.mainBodytag} onClick={() => handleMailView(e)} >{e.sendDateStr}</div><br></br>
                            <hr style={{ clear: "both", border: "none", borderTop: "1px solid black", margin: "0.1px 0" }} />
                        </div>)}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={mail.length}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                        />
                    </div>
                </div>

            </div>  {/* 메일 바디 */}

        </div> {/* 메인 창  */}


    </div>



    );





}

export default Mail;