import React from "react"

const Footer = () => {
  return (
    <footer className="my-12 text-center">
      © {new Date().getFullYear()}, Built with
      {` `}
      <a href="https://oasisbusiness.co.kr/">Oasis Business</a> and{" "}
      <a
        href="https://github.com/sminy85/sminy85.github.io"
        target="_blank"
        rel="noreferrer"
      >
        semin
      </a>
      .
    </footer>
  )
}

export default Footer
