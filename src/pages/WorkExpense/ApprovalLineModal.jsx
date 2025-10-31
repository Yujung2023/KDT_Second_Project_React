import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { caxios } from "../../config/config";

const ApprovalLineModal = ({
  open,
  onClose,
  onApply,
  initialApprovers = [],
  initialReferences = [],
  applicant
}) => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    caxios.get("/Eapproval/candidates").then((res) => {
      setCandidates(res.data || []);
    });
  }, []);

  const [approvers, setApprovers] = useState(initialApprovers);
  const [referenceList, setReferenceList] = useState(initialReferences);
  const [referenceCandidates, setReferenceCandidates] = useState([]);

  useEffect(() => {
    caxios.get("/Eapproval/reference-list")
      .then((res) => setReferenceCandidates(res.data || []))
      .catch(console.error);
  }, []);

  const rankOrder = {
    "사원": 1,
    "주임": 2,
    "대리": 3,
    "과장": 4,
    "차장": 5,
    "부장": 6,
    "임원": 7,
    "사장": 8
  };

  // ✅ 모달 열릴 때 기본 결재선 + 사장 자동 포함
  useEffect(() => {
    if (open) {
      const ceo = candidates.find((c) => c.rank_code === "사장");
      let next = [...initialApprovers];

      if (ceo && !next.some((a) => a.id === ceo.id)) {
        next.push({
          id: ceo.id,
          name: ceo.name,
          rank_code: ceo.rank_code
        });
      }

      setApprovers(next);
      setReferenceList(initialReferences);
    }
  }, [open, initialApprovers, initialReferences, candidates]);

  const approverCandidates = useMemo(
    () =>
      candidates.filter((c) =>
        c.id !== applicant?.id &&
        !approvers.some((a) => a.id === c.id) &&
        !referenceList.some((r) => r.id === c.id) &&
        (
          c.rank_code === "사장" || // ✅ 사장 예외처리
          (
            c.dept_code === applicant?.dept_code &&
            rankOrder[c.rank_code] > rankOrder[applicant?.rank_code]
          )
        )
      ),
    [candidates, applicant, approvers, referenceList]
  );

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = [...approvers];
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setApprovers(items);
  };

  const addApprover = (id) => {
    const found = approverCandidates.find((u) => u.id === id);
    if (found) {
      setApprovers((prev) => [
        ...prev,
        { id: found.id, name: found.name, rank_code: found.rank_code }
      ]);
    }
  };

  const removeApprover = (id) => {
    setApprovers((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleReference = (user) => {
    setReferenceList((prev) =>
      prev.some((ref) => ref.id === user.id)
        ? prev.filter((ref) => ref.id !== user.id)
        : [...prev, { id: user.id, name: user.name, rank_code: user.rank_code }]
    );
  };

  const applyAndClose = () => {
    onApply?.({ approverList: approvers, referenceNames: referenceList });
    onClose?.();
  };

  return (
    <Modal open={open} onCancel={onClose} onOk={applyAndClose} okText="저장" cancelText="취소" width={600} destroyOnClose>
      <h3 style={{ marginBottom: 12 }}>결재선 설정</h3>

      <select
        defaultValue=""
        onChange={(e) => {
          addApprover(e.target.value);
          e.target.value = "";
        }}
        style={{ padding: "6px 10px", marginBottom: 10 }}
      >
        <option value="">결재자 선택</option>
        {approverCandidates.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name} ({u.rank_code})
          </option>
        ))}
      </select>

      <div style={{ border: "1px solid #ddd", padding: 8, borderRadius: 8, background: "#fafafa", marginBottom: 16 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="approver-line">
            {(provided) => (
              <ul ref={provided.innerRef} {...provided.droppableProps} style={{ listStyle: "none", padding: 0 }}>
                {approvers.map((a, i) => (
                  <Draggable key={a.id} draggableId={a.id} index={i}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: 10,
                          marginBottom: 8,
                          border: "1px solid #ccc",
                          borderRadius: 6,
                          background: "#fff",
                          ...provided.draggableProps.style
                        }}
                      >
                        {i + 1}. {a.name} ({a.rank_code})
                        <button onClick={() => removeApprover(a.id)} style={{ color: "red" }}>삭제</button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <h4>참조</h4>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {referenceCandidates.map((u) => (
          <label key={u.id}>
            <input
              type="checkbox"
              checked={referenceList.some((ref) => ref.id === u.id)}
              onChange={() => toggleReference(u)}
            />
            &nbsp;{u.name} ({u.rank_code})
          </label>
        ))}
      </div>
    </Modal>
  );
};

export default ApprovalLineModal;
