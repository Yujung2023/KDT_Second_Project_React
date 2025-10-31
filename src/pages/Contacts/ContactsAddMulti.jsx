import { useState } from "react";
import styles from "./Contacts.module.css";
import { caxios } from '../../config/config.js';


const ContactsAddMulti = ({ onClose, handleContactsList }) => {



    const [Contacts, setContacts] = useState(
        { user_id: "", name: "", phone: ``, email: "", type: "multi", job_code: "", rank_code: "" }
    );



    const handlechange = (e) => {

        setContacts(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleAdd = () => {
        const payload = {
            ...Contacts,
            phone: String(Contacts.phone)  // 문자열 강제
        };

        caxios.post("/contacts", payload, {
            headers: { "Content-Type": "application/json" }

        }).then((res) => {
            // setContacts(res.data);
            handleContactsList();
            onClose();
        }).catch(err => {
            console.error("주소록 등록 오류:", err.response);

            alert(err.response.data);


        });
    };

    const handleOut = () => {
        onClose();
    }


    return (

        <div className={styles.container}>

            <div className={styles.mainHeader} style={{ fontSize: "40px", textAlign: "center" }}>
                공용 주소록 추가
            </div>
            <br></br>
            <div className={styles.mainBody} style={{border:"none"}}>

                <div className={styles.mainBodybox} style={{ display: "flex", marginBottom: "10px" }}>
                    <div className={styles.NewSharedMailbox1} style={{ marginLeft: "30px" }}>성함 : </div>
                    <input type="text" className={styles.NewSharedMailbox2}
                        style={{ marginLeft: "20px", border: "1px solid lightgrey", borderRadius: "10px", textAlign: "left", verticalAlign: "top", color: "black" }}
                        onChange={handlechange} name="name" value={Contacts.name} />
                </div>

                <br></br>
                <div className={styles.mainBodybox} style={{ display: "flex", marginBottom: "10px" }}>
                    <div className={styles.NewSharedMailbox1} style={{ marginLeft: "30px" }}>전화번호 : </div>
                    <input type="text" className={styles.NewSharedMailbox2}
                        style={{ marginLeft: "20px", border: "1px solid lightgrey", borderRadius: "10px", textAlign: "left", verticalAlign: "top", color: "black" }}
                        onChange={handlechange} name="phone" value={Contacts.phone} />
                </div>
                <br></br>
                <div className={styles.mainBodybox} style={{ display: "flex", marginBottom: "10px" }}>
                    <div className={styles.NewSharedMailbox1} style={{ marginLeft: "30px" }}>아이디 : </div>
                    <input type="text" className={styles.NewSharedMailbox2}
                        style={{ marginLeft: "20px", border: "1px solid lightgrey", borderRadius: "10px", textAlign: "left", verticalAlign: "top", color: "black" }}
                        onChange={handlechange} name="email" value={Contacts.email} />
                </div>
                <br></br>
                <div className={styles.mainBodybox} style={{ display: "flex", marginBottom: "10px" }}>
                    <div className={styles.NewSharedMailbox1} style={{ marginLeft: "30px" }}>부서 : </div>
                    <input type="text" className={styles.NewSharedMailbox2}
                        style={{ marginLeft: "20px", border: "1px solid lightgrey", borderRadius: "10px", textAlign: "left", verticalAlign: "top", color: "black" }}
                        onChange={handlechange} name="job_code" value={Contacts.job_code} />
                </div>
                <br></br>
                <div className={styles.mainBodybox} style={{ display: "flex", marginBottom: "10px" }}>
                    <div className={styles.NewSharedMailbox1} style={{ marginLeft: "30px" }}> 직위: </div>
                    <input type="text" className={styles.NewSharedMailbox2}
                        style={{ marginLeft: "20px", border: "1px solid lightgrey", borderRadius: "10px", textAlign: "left", verticalAlign: "top", color: "black" }}
                        onChange={handlechange} name="rank_code" value={Contacts.rank_code} />
                </div>



            </div>
            <button style={{ float: "right", marginTop: "10px", marginLeft: "10px" }} onClick={handleOut}>취소</button>
            <button style={{ float: "right", marginTop: "10px" }} onClick={handleAdd}>완료</button>
        </div>
    );
}


export default ContactsAddMulti;