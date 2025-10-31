import React, { useEffect, useState } from "react";

import styles from "./UserRegister.module.css";

import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Space, Select } from 'antd';
import { Link, useNavigate } from "react-router-dom";

import { caxios } from "../../config/config";
import { departmentOptions, jobOptions, positionOptions } from '../../config/options';
import { useDaumPostcodePopup } from 'react-daum-postcode'; // Daum 주소 검색 관련 hook
import { Alert } from 'antd';
import defaultProfile from "../../assets/images/defaultProfile.png";

const UserRegister = () => {

    //다음 주소 api
    const postcodeScriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    const open = useDaumPostcodePopup(postcodeScriptUrl);

    const handleComplete = (data) => {
        console.log(data);

        setMemberInfo(prev => ({ ...prev, zip_code: data.zonecode }));
        setMemberInfo(prev => ({ ...prev, address_line1: data.address }));
    };

    const handleClickZipcode = () => {
        open({ onComplete: handleComplete });
    };
    //여기까지가 다음 주소 api


    const navigate = useNavigate();

    const [memberInfo, setMemberInfo] = useState({
        id: "",
        password: "",
        name: "",
        englishName: "",
        employmentType: "일반직",
        hire_date: "",
        dept_code: "연구&개발",
        rank_code: "사원",
        job_code: "기획",
        personalEmail: "",
        officePhone: "",
        mobilePhone: "",
        birthDate: "",
        calendarType: "S",
        zip_code: "",
        address_line1: "",
        address_line2: "",
    });

    const [isIdChecked, setIsIdChecked] = useState(false);


    const handleMemberInfoChange = (e) => {
        const { name, value } = e.target;

        if (name == "id") {
            console.log("id변경");
            setIsIdChecked(false);
        }

        setMemberInfo(prev => ({ ...prev, [name]: value }));
    }

    const handleAdd = async () => {
        //데이터를 보낼 때는 post를 쓴다.


        // 필수값 체크
        const requiredFields = [
            { name: "id", label: "ID" },
            { name: "password", label: "비밀번호" },
            { name: "name", label: "이름" },
            { name: "employmentType", label: "근로형태" },
            { name: "hire_date", label: "입사일" },
            { name: "dept_code", label: "부서" },
            { name: "rank_code", label: "직위" },
            { name: "job_code", label: "직무" }
        ];

        for (let field of requiredFields) {
            if (!memberInfo[field.name] || memberInfo[field.name].trim() === "") {
                alert(`${field.label} 입력은 필수로 필요합니다.`);
                return;
            }
        }

        // ID 형식 체크 (알파벳+숫자 4~20자리)
        const idRegex = /^[a-z0-9]{4,20}$/;
        if (!idRegex.test(memberInfo.id)) {
            alert("ID는 4~20자리 알파벳 소문자와 숫자만 가능합니다.");
            return;
        }

        if (!isIdChecked) {
            alert("아이디 중복확인 바랍니다.");
            return false;
        }

        // 3️⃣ 비밀번호 형식 체크 (최소 8자리, 대문자, 소문자, 숫자, 특수문자 포함)
        const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!pwRegex.test(memberInfo.password)) {
            alert("비밀번호는 최소 8자리, 대문자/소문자/숫자/특수문자를 포함해야 합니다.");
            return;
        }

        // 4️⃣ 이름 체크 (한글 또는 영어만)
        const nameRegex = /^[가-힣]{2,20}$/;
        if (!nameRegex.test(memberInfo.name)) {
            alert("이름은 2~20자리 한글만 가능합니다. ");
            return;
        }

        const englishNameRegex = /^[a-zA-Z]{2,20}$/;
        if (memberInfo.englishName != "" && !englishNameRegex.test(memberInfo.englishName)) {
            alert("영어 이름은 2~20자리 영어만 가능합니다. ");
            return;
        }

        // 5️⃣ 이메일 형식 체크 (있으면)
        if (memberInfo.personalEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(memberInfo.personalEmail)) {
                alert("이메일 형식이 올바르지 않습니다.");
                return;
            }
        }

        // 휴대전화/회사전화 형식 체크 (있으면)
        const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/; // ex: 010-1234-5678
        if (memberInfo.mobilePhone && !phoneRegex.test(memberInfo.mobilePhone)) {
            alert("휴대전화 형식이 올바르지 않습니다. 예: 010-1234-5678");
            return;
        }

        const officePhoneRegex = /^\d{2,10}$/; // ex: 010-1234-5678
        if (memberInfo.officePhone && !officePhoneRegex.test(memberInfo.officePhone)) {
            alert("회사전화는 숫자만 입력해주시길 바랍니다.예: 100");
            return;
        }

        //  생년월일 형식 체크 (있으면)
        if (memberInfo.birthDate) {
            const birthRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!birthRegex.test(memberInfo.birthDate)) {
                alert("생년월일 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력하세요.");
                return;
            }
        }

        // 우편번호/주소 체크 (있으면)
        if (memberInfo.zip_code && !/^\d{5}$/.test(memberInfo.zip_code)) {
            alert("우편번호 형식이 올바르지 않습니다. 5자리 숫자로 입력하세요.");
            return;
        }

        // 세부 주소 체크 (한글 또는 영어만)
        const address_line2Regex = /^[가-힣a-zA-Z0-9\s\-#]{2,40}$/;
        if (memberInfo.address_line2 && !address_line2Regex.test(memberInfo.address_line2)) {
            alert("상세주소는 2~40자리 한글,영어,숫자만 입력 가능합니다. ");
            return;
        }

        // caxios.post("/member", memberInfo)
        //     .then(resp => {
        //         alert("회원 등록 성공", "사용자 추가가 완료되었습니다.");
        //         navigate("/management");
        //     })
        //     .catch(err => {
        //         alert("회원 등록 실패", "알 수 없는 오류가 발생했습니다.");
        //     });


        const formData = new FormData();
        formData.append("member", new Blob([JSON.stringify(memberInfo)], { type: "application/json" }));
        if (profileImage) formData.append("profileImage", profileImage);

        try {
            const resp = await caxios.post("/member", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("회원 등록 성공");
            navigate("/management");
        } catch (err) {
            alert("회원 등록 실패");
        }

    }

    const handleCheckId = () => {
        //데이터를 보낼 때는 post를 쓴다.
        if (memberInfo.id == "") {
            alert("아이디를 입력하세요");
            return false;
        }
        // ID 형식 체크 (알파벳+숫자 4~20자리)
        const idRegex = /^[a-z0-9]{4,20}$/;
        if (!idRegex.test(memberInfo.id)) {
            alert("ID는 4~20자리 알파벳 소문자와 숫자만 가능합니다.");
            return;
        }

        const currentId = memberInfo.id; // 렌더 시점의 값 고정

        caxios.post("/member/checkId", { id: currentId })
            .then(resp => {
                console.log(resp);
                if (resp.data != 0) {
                    alert("존재하는 아이디입니다.");
                    setMemberInfo(prev => ({ ...prev, id: "" }));
                }
                else {
                    alert("사용가능한 아이디입니다.");
                    setIsIdChecked(true);
                    console.log(isIdChecked);
                }
            });

        //setMemberInfo({});
    }

    const [profileImage, setProfileImage] = useState(null); // 파일 객체
    const [previewUrl, setPreviewUrl] = useState(null); // 미리보기 URL
    // 미리보기 메모리 해제
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 업로드 가능합니다.");
            e.target.value = ""; // <- 추가
            return;
        }

        setProfileImage(file);
        setPreviewUrl(URL.createObjectURL(file));

        e.target.value = ""; // <- 이 줄이 중요
    };

    const handleRemoveImage = () => {
        setProfileImage(null);
        setPreviewUrl(null);
    };



    return (
        <div className={styles.container}>

            <h1>사용자 등록</h1>

            <div className={styles.content}>
                {/* ----------left는 프로필 들어가는 자리 */}
                <div className={styles.left}>
                    <div className={styles.profileContainer}>
                        {previewUrl ? (
                            <img src={previewUrl} alt="프로필 미리보기" className={styles.profileImage} />
                        ) : (
                            <img src={defaultProfile} alt="프로필 미리보기" className={styles.profileImage} />
                        )}
                        <div className={styles.profileButtons}>
                            <label htmlFor="profileUpload" className={styles.uploadBtn}>이미지 선택</label>
                            {previewUrl && (
                                <div><button onClick={handleRemoveImage} className={styles.removeBtn}>삭제</button></div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            id="profileUpload"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                    </div>
                </div>
                <div className={styles.right}>
                    <div><label>ID*</label><Input placeholder="알파벳+숫자 4~20자리" name='id' value={memberInfo.id} onChange={handleMemberInfoChange} /> <button className={styles.idBtn} onClick={handleCheckId}>중복확인</button></div>
                    <div><label>비밀번호*</label><Input placeholder="최소 8자리, 대문자, 소문자, 숫자, 특수문자" name='password' value={memberInfo.password} onChange={handleMemberInfoChange} /></div>
                    <div><label>이름*</label><Input placeholder="한글 2~20자리" name='name' value={memberInfo.name} onChange={handleMemberInfoChange} /></div>
                    <div><label>영어 이름</label><Input placeholder="영문 이름 입력" name='englishName' value={memberInfo.englishName} onChange={handleMemberInfoChange} /></div>

                    <div>
                        <label>근로형태*</label>
                        <Space wrap>
                            <Select
                                defaultValue="일반직"
                                style={{ width: 288 }}
                                onChange={(value) =>                     // 선택하면 state 업데이트
                                    setMemberInfo(prev => ({ ...prev, employmentType: value }))
                                }
                                options={[

                                    { value: '일반직', label: '일반직' },
                                    { value: '임원,촉탁', label: '임원,촉탁' },
                                ]}
                            />

                        </Space>
                    </div>


                    <div className={styles.hire_date}>
                        <label>입사일*</label>
                        <Input
                            type="date"
                            placeholder="YYYY-MM-DD"
                            value={memberInfo.hire_date}
                            onChange={(e) =>
                                setMemberInfo(prev => ({ ...prev, hire_date: e.target.value }))
                            }
                        />
                    </div>
                    {/* <div><label>사번*</label><Input placeholder="사번 입력" /></div> */}


                    <div>
                        <label>부서*</label>
                        <Space wrap>
                            <Select
                                defaultValue="연구&개발"
                                style={{ width:  288 }}
                                onChange={(value) =>                     // 선택하면 state 업데이트
                                    setMemberInfo(prev => ({ ...prev, dept_code: value }))
                                }
                                options={departmentOptions}
                            />
                        </Space>
                    </div>
                    <div>
                        <label>직위*</label><Space wrap>
                            <Select
                                defaultValue="사원"
                                style={{ width:  288 }}
                                onChange={(value) =>                     // 선택하면 state 업데이트
                                    setMemberInfo(prev => ({ ...prev, rank_code: value }))
                                }
                                options={positionOptions}
                            />

                        </Space>
                    </div>
                    <div>
                        <label>직무*</label><Space wrap>
                            <Select
                                defaultValue="기획"
                                style={{ width:  288 }}
                                onChange={(value) =>                     // 선택하면 state 업데이트
                                    setMemberInfo(prev => ({ ...prev, job_code: value }))
                                }
                                options={jobOptions}
                            />

                        </Space>
                    </div>

                    <div><label>개인 이메일</label><Input placeholder="example@email.com" name='personalEmail' value={memberInfo.personalEmail} onChange={handleMemberInfoChange} /></div>
                    <div><label>회사전화</label><Input placeholder="회사 전화 입력" name='officePhone' value={memberInfo.officePhone} onChange={handleMemberInfoChange} /></div>
                    <div><label>휴대전화</label><Input placeholder="휴대전화 입력" name='mobilePhone' value={memberInfo.mobilePhone} onChange={handleMemberInfoChange} /></div>

                    <div className={styles.birth}>
                        <label>생년월일</label>
                        <Input
                            type="date"
                            placeholder="YYYY-MM-DD"
                            value={memberInfo.birthDate}
                            onChange={(e) =>
                                setMemberInfo(prev => ({ ...prev, birthDate: e.target.value }))
                            }
                        />
                        <span className={styles.birthSpan}>
                            <input type="radio" id="solar" name="calendarType" value="S" onChange={() => setMemberInfo(prev => ({ ...prev, calendarType: "S" }))} defaultChecked />
                            <label htmlFor="solar" className={styles.birthLabel}>양력</label>
                            <input type="radio" id="lunar" name="calendarType" value="L" onChange={() => setMemberInfo(prev => ({ ...prev, calendarType: "L" }))} />
                            <label htmlFor="lunar" className={styles.birthLabel}>음력</label>
                        </span>
                    </div>

                    <div className={styles.address}>
                        <label>주소</label>
                        <Input readOnly name='zip_code' value={memberInfo.zip_code} onChange={handleMemberInfoChange} placeholder="우편 번호" />
                        <button onClick={handleClickZipcode} >우편번호 검색</button>
                    </div>
                    <div>
                        <label></label>
                        <Input readOnly name="address_line1"
                            style={{width:'100px'}}
                            value={memberInfo.address_line1}
                            onChange={handleMemberInfoChange}
                            placeholder="주소" />

                    </div>
                    <div>
                        <label></label>
                        <Input placeholder="상세 주소 입력" name="address_line2"
                            value={memberInfo.address_line2}
                            onChange={handleMemberInfoChange} />
                    </div>
                    <div className={styles.bottomButton}>
                        <button onClick={handleAdd}>등록</button>
                        <button onClick={() => navigate(-1)}>취소</button>
                    </div>
                </div>
            </div>

        </div >
    );
}

export default UserRegister;
