import { format, formatDistanceToNow } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'
import { Comment } from './Comment';
import { Avatar } from './Avatar';

import styles from './Post.module.css';
import { ChangeEvent, FormEvent, InvalidEvent, useState } from 'react';

interface Author {
    name: string;
    role: string;
    avatarUrl: string;
}

interface Content{
    type: 'paragraph' | 'link';
    content: string;
}

interface PostProps{
    author: Author;
    publishedAt: Date;
    content: Content[];
}

export function Post({ author, publishedAt, content } : PostProps) {
    //lembre-se que a variavel não pode ser alterado somente por meio do método
    const [comments, setComments] = useState([
        'Post muito bacana, hein?'
    ])

    const [newCommentText, setNewCommentText] = useState('')

    const publishedDateFormatted = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
        locale: ptBR,
    })

    const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
        locale: ptBR,
        addSuffix: true,
    })
    //Sempre for uma ação que o usuario realiza utilizar Handle no método
    function HandleCreateNewComment(event : FormEvent) {
        event.preventDefault()
        //imutabilidade = não passar só o valor que voce quer inserir   
        //mas sim o novo valor 
        setComments([...comments, newCommentText])
        setNewCommentText('')
    }

    function handleNewCommentChange(event : ChangeEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity('')
        setNewCommentText(event.target.value);
    }

    function deleteComment(commentToDelete : string) {
        const commentsWithoutDeletedOne = comments.filter(commente => {
            return commente != commentToDelete
        })
        setComments(commentsWithoutDeletedOne)
    }

    function handleNewCommentInvalid(event : InvalidEvent<HTMLTextAreaElement>) {
        //Método que exibe uma mensagem personalizada quando o input é invalido
        event.target.setCustomValidity('Esse campo é obrigatório')
    }
    
    const isNewCommentEmpty = newCommentText.length == 0

    return (
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <Avatar
                        src={author.avatarUrl}
                    />
                    <div className={styles.authorInfo}>
                        <strong>{author.name}</strong>
                        <span>{author.role}</span>

                    </div>
                </div>

                <time title={publishedDateFormatted} dateTime={publishedAt.toISOString()}>
                    {publishedDateRelativeToNow}
                </time>
            </header>

            <div className={styles.content}>
                {content.map(item => {
                    if (item.type == 'paragraph') {
                        return <p key={item.content}>{item.content}</p>;
                    } else if (item.type == 'link') {
                        return <p key={item.content}><a href="#">{item.content}</a></p>
                    }
                })}
            </div>
            <form onSubmit={HandleCreateNewComment} className={styles.commentForm}>
                <strong>Deixe seu Feedback</strong>

                <textarea
                    name='comment'
                    placeholder='Deixe um comentário'
                    //monitora toda vez que houver uma mundança
                    onChange={handleNewCommentChange}
                    value={newCommentText}
                    onInvalid={handleNewCommentInvalid}
                    required
                />

                <footer>
                    <button
                        type='submit'
                        disabled={isNewCommentEmpty}>
                        Publicar
                    </button>
                </footer>

            </form>

            <div className={styles.commentList}>
                {comments.map(comment => {
                    return (
                        <Comment
                            key={comment}
                            content={comment}
                            WhenDeleteComment={deleteComment}
                        />
                    )
                })}
            </div>
        </article>
    )
}