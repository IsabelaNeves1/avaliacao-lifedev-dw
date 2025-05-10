import styles from './Footer.module.css'

const Footer = () => {
  return (
    <>
    <footer className={styles.footer}>
      <h3>Plataforma de Postagens para Desenvolvedores</h3>
      <p>Compartilhamento de experiências de Nomade Life Dev</p>
      <p className={styles.copyright}>Icoma Education® 2025©</p>
    </footer>
    </>
  )
}

export default Footer