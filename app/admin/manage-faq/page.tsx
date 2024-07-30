// app/admin/manage-faq/page.tsx
'use client';

// dependency modules
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// self-defined modules
import { ContactBox, Navbar } from '@/app/page';
import { CommandLeft } from '@/app/admin/commandLeft';
import { readAllFaqs, createFaq, updateFaq, deleteFaq } from '@/app/utils/faqApi';
import { Faq } from '@/app/utils/types';

export default function Adminquestion() {
    return (
        <div>
            <div className="min-h-screen flex flex-col p-10 mt-16">
                <Navbar />
                <div className="flex flex-col md:flex-row flex-grow">
                    <CommandLeft />
                    <div className="flex-grow ml-0 md:ml-7 py-[0.15rem]">
                        <Managequestion />
                    </div>
                </div>
            </div>
            <ContactBox />
        </div>
    );
}

function Managequestion() {
    const router = useRouter();
    const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
    const [showLimitPopup, setShowLimitPopup] = useState<string | null>(null);
    const [faqs, setFaqs] = useState<Faq[]>([]);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const faqs = await readAllFaqs();
                setFaqs(faqs);
            } catch (error: any) {
                console.error(error.message);
            }
        };
        fetchFaqs();
    }, []);

    const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
    const [editedQuestion, setEditedQuestion] = useState({ question: '', answer: '' });
    const [newQuestion, setNewQuestion] = useState({ question: '', answer: '' });

    const confirmDelete = (id: number) => {
        setQuestionToDelete(id);
        setShowPopup(true);
    };

    const handleDelete = async () => {
        if (questionToDelete !== null) {
            try {
                await deleteFaq(questionToDelete);
                setFaqs(faqs.filter(question => question.id !== questionToDelete));
                setShowPopup(false);
                setQuestionToDelete(null);
            } catch (error: any) {
                console.error('Failed to delete FAQ:', error.message);
            }
        }
    };

    const toggleQuestion = (id: number) => {
        if (editingQuestionId === id) {
            setEditingQuestionId(null);
        } else {
            setExpandedQuestionId(expandedQuestionId === id ? null : id);
        }
    };

    const handleAddClick = () => {
        if (faqs.length >= 10) {
            setShowLimitPopup('Tidak dapat menambah FAQ lagi. Jumlah maksimum adalah 10.');
        } else {
            setShowAddPopup(true);        }
    };

    const handleDeleteClick = (id: number) => {
        if (faqs.length <= 5) {
            setShowLimitPopup('Tidak dapat menghapus FAQ lagi. Jumlah minimum adalah 5.');
        } else {
            confirmDelete(id);
        }
    };

    const handleEditClick = (id: number) => {
        const questionToEdit = faqs.find(question => question.id === id);
        if (questionToEdit) {
            setEditingQuestionId(id);
            setEditedQuestion({ question: questionToEdit.question, answer: questionToEdit.answer });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedQuestion(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSave = async (id: number) => {
        if (editingQuestionId !== null) {
            try {
                await updateFaq(id, editedQuestion);
                setFaqs(faqs.map(question => question.id === id ? { ...question, ...editedQuestion } : question));
                setEditingQuestionId(null);
            } catch (error: any) {
                console.error('Failed to update FAQ:', error.message);
            }
        }
    };

    const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewQuestion(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddSubmit = async () => {
        if (faqs.length < 10) {
            const newId = faqs.length > 0 ? faqs[faqs.length - 1].id + 1 : 1;
            try {
                await createFaq(newQuestion);
                setFaqs([...faqs, { id: newId, ...newQuestion }]);
                setShowAddPopup(false);
                setNewQuestion({ question: '', answer: '' });
            } catch (error: any) {
                console.error('Failed to add FAQ:', error.message);
            }
        } else {
            setShowLimitPopup('Tidak dapat menambah FAQ lagi. Jumlah maksimum adalah 10.');
        }
    };

    return (
        <div className="px-8 pt-6 pb-10 bg-white rounded-xl font-sofia shadow-md">
            <h1 className="text-3xl font-bold mb-3 text-pink-900">Welcome Admin LogEvent!</h1>
            <div className="flex items-center text-black mb-4 w-full">
                <span className="mr-2 text-lg">Total FAQ</span>
                <span className="text-2xl font-bold border-pink-900 border-2 px-3 py-1">{faqs.length}</span>
                <div className="flex justify-end items-center space-x-4 ml-auto">
                    <button
                        className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-md"
                        onClick={handleAddClick}
                    >
                        + Tambah FAQ
                    </button>
                </div>
            </div>
            {faqs.map(question => (
                <div key={question.id} className="bg-white p-4 rounded-md mb-2 text-black shadow-md">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <button onClick={() => toggleQuestion(question.id)} className="flex items-center">
                                <span className="mr-2">{expandedQuestionId === question.id ? 'V' : '>'}</span>
                                <span className="ml-2">{question.id}. {question.question}</span>
                            </button>
                        </div>
                        <div className="flex items-center">
                            <button
                                className="bg-white hover:bg-pink-100 border border-pink-500 text-pink-500 px-3 py-[0.35rem] rounded-md mr-2"
                                onClick={() => handleEditClick(question.id)}
                            >
                                Edit FAQ
                            </button>
                            <button
                                className="bg-red-500 text-white p-2 rounded-md"
                                onClick={() => handleDeleteClick(question.id)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6.5 4a1 1 0 00-.894.553L5 5H3a1 1 0 000 2h1v9a2 2 0 002 2h8a2 2 0 002-2V7h1a1 1 0 100-2h-2l-.606-1.447A1 1 0 0013.5 4h-7zM6 7v9h8V7H6zm4-3a1 1 0 011 1v1h-2V5a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {expandedQuestionId === question.id && (
                        <div className="mt-5">
                            {editingQuestionId === question.id ? (
                                <>
                                    <p>Pertanyaan:</p>
                                    <input
                                        type="text"
                                        name="question"
                                        value={editedQuestion.question}
                                        onChange={handleInputChange}
                                        className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                                    />
                                    <p>Jawaban:</p>
                                    <textarea
                                        name="answer"
                                        value={editedQuestion.answer}
                                        onChange={handleInputChange}
                                        className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <button
                                            className="bg-blue-500 text-white p-2 rounded-md"
                                            onClick={() => handleSave(question.id)}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>{question.answer}</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            ))}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-red-500 text-white p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 8v4m0 4h.01m0-4h-.01m-.01 0h.01M11 8v4m0 4h.01m0-4h-.01m-.01 0h.01" />
                                </svg>
                            </div>
                        </div>
                        <p className="mb-4 text-black">Apakah Anda yakin ingin menghapus pertanyaan ini?</p>
                        <p className="mb-6 text-black">Dengan menekan tombol YA maka pertanyaan dan jawaban akan terhapus dan pengunjung tidak akan dapat melihatnya lagi</p>
                        <div className="flex justify-center space-x-4">
                            <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={() => setShowPopup(false)}>Tidak</button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded-md" onClick={handleDelete}>Ya</button>
                        </div>
                    </div>
                </div>
            )}
            {showAddPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10 font-sofia">
                    <div className="bg-white p-4 rounded-md text-black w-1/3">
                        <h2 className="text-xl text-center font-bold mb-4 text-cen">Tambah FAQ Baru</h2>
                        <p>Pertanyaan:</p>
                        <textarea
                            name="question"
                            value={newQuestion.question}
                            onChange={handleAddInputChange}
                            placeholder="Enter question"
                            className="bg-gray-100 p-2 rounded-md w-full mb-2"
                        />
                        <p>Jawaban:</p>
                        <textarea
                            name="answer"
                            value={newQuestion.answer}
                            onChange={handleAddInputChange}
                            placeholder="Enter answer"
                            className="bg-gray-100 p-2 rounded-md w-full mb-2"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowAddPopup(false)}
                                className="bg-gray-300 px-4 py-2 rounded-md  mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddSubmit}
                                className="bg-green-500 text-white px-4 py-2 rounded-md"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showLimitPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-lg text-center">
                        <div className="flex items-center justify-center mb-4">
                            <div className="bg-yellow-500 text-white p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 8v4m0 4h.01m0-4h-.01m-.01 0h.01M11 8v4m0 4h.01m0-4h-.01m-.01 0h.01" />
                                </svg>
                            </div>
                        </div>
                        <p className="mb-6 text-black">{showLimitPopup}</p>
                        <div className="flex justify-center">
                            <button className="bg-gray-500 text-white px-4 py-2 rounded-md" onClick={() => setShowLimitPopup(null)}>OK</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}