import styles from "./Contacts.module.css";
import { useEffect, useState } from 'react';
import { caxios } from '../../config/config.js';
import { useNavigate } from "react-router-dom";
import OrganizationView from "./OrganizationView.jsx";
import { Button, Modal } from 'antd';
const Organization = () => {

    const [organization, setOrganization] = useState([]);
    const [openTeams, setOpenTeams] = useState({});
    const [selectedTeam, setSelectedTeam] = useState(null); // 선택된 팀
    const [searchName, setSearchName] = useState(""); // 검색어 상태
    const [checkedList, setCheckedList] = useState([]); // 체크 상태 관리 seq 아닌 id 기준
    const [allChecked, setAllChecked] = useState(false); // 전체 체크 상태 seq 아닌 id 기준

    const teams = [

        { name: "연구&개발" },
        { name: "사업관리팀" },
        { name: "AI센터", },
        { name: "인사관" },
        { name: "재무/회계" },
        { name: "마케팅팀" },

    ];

    const Navigate = useNavigate();

    // 조직도 리스트 출력
    const handleOrganizationList = () => {
        const params = {};
        if (searchName) params.name = searchName;
        caxios.get("/contacts/organization", { params, withCredentials: true })
            .then(resp => {
                setOrganization(resp.data);
            });
    }

    // 페이지 로딩시 리스트 출력
    useEffect(() => {
        handleOrganizationList();
    }, []);

    // 전체 체크박스를 클릭하면(true) 아래 체크박스 전체 적용
    useEffect(() => {
        if (organization.length > 0 && checkedList.length === organization.length) {
            setAllChecked(true);
        } else {
            setAllChecked(false);
        }
    }, [checkedList, organization]);

    // 전체 체크박스 선택
    const handleAllcheckbox = () => {
        if (!allChecked) {
            // 모든 체크
            setCheckedList(organization.map(organization => organization.id));
            setAllChecked(true);
        } else {
            // 모두 해제
            setCheckedList([]);
            setAllChecked(false);
        }
    }

    // 개별 체크박스 선택
    const handleSingleCheck = (id) => {

        if (checkedList.includes(id)) {
            setCheckedList(checkedList.filter(item => item !== id));
        } else {
            setCheckedList([...checkedList, id]);
        }
    }


    // 공유 주소록으로 이동
    const handleContactsUpdateTypeMulti = async () => {
        await caxios.put("/contacts/orgType", { idList: checkedList, type: "multi" }, { withCredentials: true });

        setCheckedList([]);
        setAllChecked(false);
        handleOrganizationList();
    }


    // // 개인 주소록으로 이동
    // const handleContactsUpdateTypeSingle = async () => {
    //     caxios.put("/contacts/orgType", { idList: checkedList, type: "solo" }, { withCredentials: true });

    //     setCheckedList([]);
    //     setAllChecked(false);
    //     handleOrganizationList();
    // }



    // modal

    const [orgModalOpen, setOrgModalOpen] = useState(false);

    const showOrgModal = (memberData) => {
        setMember(memberData);
        setOrgModalOpen(true);
    };

    const [member, setMember] = useState(null); // 모달에 보낼 member


    return (
        <div className={styles.container} style={{ height: "700px", display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Header */}
            <div className={styles.mainHeader} style={{fontSize:"35px"}}>
                {selectedTeam
                    ? `조직도 총 ${organization.filter(e => e.dept_code === selectedTeam).length}명`
                    : `조직도 총 ${organization.length}명`}
                <div className={styles.mainHeaderbottom} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {checkedList.length === 0 ? (
                        <>
                            <div style={{ display: "flex", gap: "10px", width: "50%" }}>
                                <input
                                    type="text"
                                    placeholder="검색할 이름"
                                    style={{
                                        flex: 1,
                                        borderRadius: "10px",
                                        border: "none",
                                        fontSize: "20px"
                                    }}
                                    onChange={(e) => setSearchName(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleOrganizationList(); }}
                                />
                                <button
                                    onClick={handleOrganizationList}
                                    style={{ padding: "5px 15px", fontSize: "16px" }}
                                >
                                    검색
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ fontSize: "25px" }}>선택된 {checkedList.length}명</span>
                                <Button type="primary" size="small" onClick={handleContactsUpdateTypeMulti} style={{marginLeft:"50px" ,fontSize: "20px" }}>
                                    공용 주소록으로
                                </Button>
                            </div>
                        </>
                    )}
                </div>

            </div>

            {/* Body */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden", gap: "10px", fontSize: "20px" }}>

                {/* Team Sidebar */}
                <div style={{
                    width: "15%",
                    backgroundColor: "#f0f2f5",
                    borderRadius: "6px",
                    overflowY: "auto",
                    padding: "10px",
                    fontSize: "16px"
                }}>
                    <div style={{
                        marginTop: "10px",
                        cursor: "pointer",
                        textAlign: "center",
                        fontSize: "20px"

                    }}
                        onClick={() => { setSelectedTeam(null); setCheckedList([]); }}
                    >
                        전체
                    </div>
                    {teams.map((team, i) => (
                        <div
                            key={i}
                            style={{
                                marginTop: "35px",
                                marginBottom: "25px",
                                padding: "5px",
                                cursor: "pointer",
                                backgroundColor: selectedTeam === team.name ? "#1890ff" : "transparent",
                                color: selectedTeam === team.name ? "#fff" : "#000",
                                borderRadius: "4px",
                                transition: "all 0.2s",
                                textAlign: "center",
                                fontSize: "20px"
                            }}
                            onClick={() => { setSelectedTeam(team.name); setCheckedList([]); }}
                        >
                            {team.name}
                        </div>
                    ))}
                </div>

                {/* Organization Table */}
                <div style={{ flex: 1, overflowY: "auto", borderRadius: "6px", border: "1px solid #d9d9d9" }}>
                    <div style={{ display: "flex", backgroundColor: "#fafafa", padding: "10px", borderBottom: "1px solid #d9d9d9", textAlign: "center" }}>
                        <div style={{ flex: 0.5 }}><input type="checkbox" onClick={handleAllcheckbox} /></div>
                        <div style={{ flex: 1 }}>부서</div>
                        <div style={{ flex: 1 }}>이름</div>
                        <div style={{ flex: 1 }}>직위</div>
                        <div style={{ flex: 1 }}>직무</div>
                        <div style={{ flex: 1 }}>재직여부</div>
                    </div>

                    {(selectedTeam ? organization.filter(e => e.dept_code === selectedTeam) : organization).map(e => (
                        <div key={e.id} style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px",
                            borderBottom: "1px solid #f0f0f0",
                            backgroundColor: checkedList.includes(e.id) ? "#e6f7ff" : "transparent",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            textAlign: "center"
                        }}>
                            <div style={{ flex: 0.5 }}>
                                <input type="checkbox" checked={checkedList.includes(e.id)} onChange={() => handleSingleCheck(e.id)} />
                            </div>
                            <div style={{ flex: 1 }} onClick={() => showOrgModal(e)}>{e.dept_code}</div>
                            <div style={{ flex: 1 }} onClick={() => showOrgModal(e)}>{e.name}</div>
                            <div style={{ flex: 1 }} onClick={() => showOrgModal(e)}>{e.rank_code}</div>
                            <div style={{ flex: 1 }} onClick={() => showOrgModal(e)}>{e.job_code}</div>
                            <div style={{ flex: 1 }} onClick={() => showOrgModal(e)}>{e.status}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <Modal
                centered={false}
                open={orgModalOpen}
                onCancel={() => setOrgModalOpen(false)}
                footer={null}
                destroyOnHidden
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '30%',
                }}
                modalRender={modal => <div style={{ marginTop: '100px' }}>{modal}</div>}
            >
                <OrganizationView member={member} onClose={() => setOrgModalOpen(false)} />
            </Modal>
        </div>
    );
}
export default Organization;