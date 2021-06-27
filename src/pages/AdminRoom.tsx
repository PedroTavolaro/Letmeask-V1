
import { useHistory, useParams } from 'react-router-dom';

import Modal from 'react-modal';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';


import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
//import { useAuth } from '../hooks/useAuth';

import { Question } from '../components/Question';
 

import '../styles/room.scss';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import { useState, Fragment } from 'react';




type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory()
 //   const {user} = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const [questionIdModalOpen, setQuestionIdModalOpen] = useState<string | undefined>();

    const { title, questions } = useRoom(roomId)

    

    async function handleEndRoom() {
        database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }

   async function handleDeleteQuestion(questionId: string){
        if (window.confirm('Tem certeza que você deseja excluir essa pergunta?')){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });

    }
    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        });
    }

   

    return(
        <div id='page-room'>
            <header>
                <div className='content'>
                    <img src={logoImg} alt='Letmeask' />
                    <div>
                    <RoomCode code={roomId} />
                    <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className='room-title'>
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

           

           <div className='question-list'>
           {questions.map(question => {
                return (
                 <Fragment key={question.id}>
                    <Question 
                
                    content={question.content}
                    author={question.author}
                    isAnswered={question.isAnswered}
                    isHighlighted={question.isHighlighted}
                    >
                    {!question.isAnswered && (
                        <>
                        <button
                        type='button'
                        onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                        <img src={checkImg} alt='marcar pergunta como respondida' />
                    </button>

                    <button
                        type='button'
                        onClick={() => handleHighlightQuestion(question.id)}
                    >
                        <img src={answerImg} alt='dar destaques a pergunta' />
                    </button>
                    </>
                    )}

                    <button
                        type='button'
                        onClick={() => setQuestionIdModalOpen(question.id)}
                    >
                        <img src={deleteImg} alt='remover pergunta' />
                    </button>
                    </Question>

                    <Modal 
                    isOpen = {questionIdModalOpen === question.id}
                     onRequestClose={() => setQuestionIdModalOpen(undefined)}
                     
                    >
                        <button onClick={() => handleDeleteQuestion(question.id)}>Deletar</button>
                        <button onClick={() => setQuestionIdModalOpen(undefined)}>fechar</button>
                    </Modal>
                </Fragment>
                );
            })}
           </div>
        </main>
 
        
    </div>
    );
}