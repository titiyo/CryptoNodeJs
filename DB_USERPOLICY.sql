-- phpMyAdmin SQL Dump
-- version 4.0.4
-- http://www.phpmyadmin.net
--
-- Client: localhost
-- Généré le: Jeu 13 Mars 2014 à 22:38
-- Version du serveur: 5.6.12-log
-- Version de PHP: 5.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données: `userpolicy`
--
CREATE DATABASE IF NOT EXISTS `userpolicy` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `userpolicy`;

-- --------------------------------------------------------

--
-- Structure de la table `certificate`
--

CREATE TABLE IF NOT EXISTS `certificate` (
  `idCertificate` int(11) NOT NULL AUTO_INCREMENT,
  `certificatePath` varchar(200) NOT NULL,
  `certificatParent` varchar(200) NOT NULL,
  `selfSigned` boolean NOT NULL,
  PRIMARY KEY (`idCertificate`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `request`
--

CREATE TABLE IF NOT EXISTS `request` (
  `idRequest` int(11) NOT NULL,
  `requestPath` varchar(200) NOT NULL,
  `ca` varchar(200) NOT NULL,
  PRIMARY KEY (`idRequest`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `role`
--

CREATE TABLE IF NOT EXISTS `role` (
  `roleId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`roleId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Contenu de la table `role`
--

INSERT INTO `role` (`roleId`, `name`, `description`) VALUES
(1, 'Admin', 'Access to the back office.'),
(2, 'Member', 'Access to the front office.');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `userName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createDate` date DEFAULT NULL,
  `keyPath` varchar(200) NOT NULL,
  `roleId` int(11) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  KEY `roleId` (`roleId`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Contenu de la table `user`
--

INSERT INTO `user` (`userId`, `firstName`, `lastName`, `userName`, `email`, `password`, `createDate`, `keyPath`, `roleId`) VALUES
(1, 'Admin', 'Admin', 'Admin', 'Admin@Mypki.fr', 'Admin', '2014-03-03', '', 1),
(2, 'Member', 'Member', 'Member', 'Member@Mypki.fr', 'Member', '2014-03-03', '', 2);

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`roleId`) REFERENCES `role` (`roleId`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
