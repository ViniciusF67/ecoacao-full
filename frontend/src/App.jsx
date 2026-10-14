import { Routes, Route } from 'react-router-dom'
import Layout from './layout/Layout.jsx'
import RotaProtegida from './layout/RotaProtegida.jsx'
import RotaAdmin from './layout/RotaAdmin.jsx'

import AdminLayout from './pages/Admin/AdminLayout.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import AdminNoticias from './pages/Admin/AdminNoticias.jsx'
import AdminConteudos from './pages/Admin/AdminConteudos.jsx'
import AdminDesafios from './pages/Admin/AdminDesafios.jsx'
import AdminOrganizacoes from './pages/Admin/AdminOrganizacoes.jsx'
import AdminQuizzes from './pages/Admin/AdminQuizzes.jsx'
import AdminCategorias from './pages/Admin/AdminCategorias.jsx'
import AdminUsuarios from './pages/Admin/AdminUsuarios.jsx'

import Home from './pages/Home/Home.jsx'
import Sobre from './pages/Sobre/Sobre.jsx'
import Contato from './pages/Contato/Contato.jsx'

import Noticias from './pages/Noticias/Noticias.jsx'
import NoticiaDetalhes from './pages/NoticiaDetalhes/NoticiaDetalhes.jsx'

import Conteudos from './pages/Conteudos/Conteudos.jsx'
import ConteudoDetalhes from './pages/ConteudoDetalhes/ConteudoDetalhes.jsx'

import Quiz from './pages/Quiz/Quiz.jsx'
import QuizPlay from './pages/Quiz/QuizPlay.jsx'
import ResultadoQuiz from './pages/ResultadoQuiz/ResultadoQuiz.jsx'

import Desafios from './pages/Desafios/Desafios.jsx'
import DesafioDetalhes from './pages/DesafioDetalhes/DesafioDetalhes.jsx'

import Organizacoes from './pages/Organizacoes/Organizacoes.jsx'
import OrganizacaoDetalhes from './pages/OrganizacaoDetalhes/OrganizacaoDetalhes.jsx'

import Login from './pages/Login/Login.jsx'
import Cadastro from './pages/Cadastro/Cadastro.jsx'
import Perfil from './pages/Perfil/Perfil.jsx'
import EditarPerfil from './pages/EditarPerfil/EditarPerfil.jsx'

import NaoEncontrada from './pages/NaoEncontrada/NaoEncontrada.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/contato" element={<Contato />} />

        <Route path="/noticias" element={<Noticias />} />
        <Route path="/noticias/:id" element={<NoticiaDetalhes />} />

        <Route path="/conteudos" element={<Conteudos />} />
        <Route path="/conteudos/:id" element={<ConteudoDetalhes />} />

        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/:id" element={<QuizPlay />} />
        <Route path="/quiz/:id/resultado" element={<ResultadoQuiz />} />

        <Route path="/desafios" element={<Desafios />} />
        <Route path="/desafios/:id" element={<DesafioDetalhes />} />

        <Route path="/organizacoes" element={<Organizacoes />} />
        <Route path="/organizacoes/:id" element={<OrganizacaoDetalhes />} />

        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route
          path="/perfil"
          element={
            <RotaProtegida>
              <Perfil />
            </RotaProtegida>
          }
        />
        <Route
          path="/perfil/editar"
          element={
            <RotaProtegida>
              <EditarPerfil />
            </RotaProtegida>
          }
        />

        <Route
          path="/admin"
          element={
            <RotaAdmin>
              <AdminLayout />
            </RotaAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="noticias" element={<AdminNoticias />} />
          <Route path="conteudos" element={<AdminConteudos />} />
          <Route path="desafios" element={<AdminDesafios />} />
          <Route path="organizacoes" element={<AdminOrganizacoes />} />
          <Route path="quizzes" element={<AdminQuizzes />} />
          <Route path="categorias" element={<AdminCategorias />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
        </Route>

        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  )
}
