import { FormEvent, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import cx from 'classnames';

import illustrationImg from '../../assets/images/illustration.svg';
import illustrationDarkImg from '../../assets/images/illustration-dark.svg';
import logoImg from '../../assets/images/logo.svg';
import logoDarkImg from '../../assets/images/logo-dark.svg';

import { Button } from '../../components/Button';
import { database } from '../../services/firebase';

import { useAuth } from '../../hooks/useAuth';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useTheme } from '../../hooks/useTheme';

import '../Home/styles.scss';

export function NewRoom() {
	const { user } = useAuth();
	const { handleTitleChange } = usePageTitle();
	const history = useHistory();
	const { theme } = useTheme();

	const [newRoom, setNewRoom] = useState('');

	async function handleCreateRoom(event: FormEvent) {
		event.preventDefault();

		if (newRoom.trim() === '') {
			return;
		}

		const roomRef = database.ref('rooms');

		const firebaseRoom = await roomRef.push({
			title: newRoom,
			authorId: user?.id,
		});

		history.push(`/rooms/${firebaseRoom.key}`)
	}

	function handleMyRooms() {
		if (!user) {
			return alert('Você precisa estar logado para ver suas salas.');
		}

		history.push('/admin/rooms');
	}

	useEffect(() => {
		handleTitleChange('Nova sala - Letmeask');
	}, [handleTitleChange]);

	return (
		<div id='page-auth' className={cx(theme)}>
			<aside>
				<img
					src={theme === 'dark-theme' ? illustrationDarkImg : illustrationImg}
					alt='Ilustração simbolizando perguntas e respostas'
				/>
				<strong>Crie salas de Q&amp;A ao-vivo</strong>
				<p>Tire as dúvidas da sua audiência em tempo real</p>
			</aside>

			<main>
				<div className='main-content'>
					<img src={theme === 'dark-theme' ? logoDarkImg : logoImg} alt='Letmeask' />
					<h2>Criar uma nova sala</h2>
					<form onSubmit={handleCreateRoom}>
						<input
							type='text'
							placeholder='Nome da sala'
							onChange={event => setNewRoom(event.target.value)}
							value={newRoom}
						/>
						<Button type='submit'>
							Criar sala
						</Button>
						{user && (
							<Button type='button' onClick={handleMyRooms} isOutlined>
								Minhas salas
							</Button>
						)}
					</form>
					<p>Quer entrar em uma sala existente? <Link to='/'>Clique aqui</Link></p>
				</div>
			</main>
		</div>
	)
}