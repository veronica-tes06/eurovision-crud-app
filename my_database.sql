CREATE DATABASE IF NOT EXISTS Eurovision2025CrudApp;
USE Eurovision2025CrudApp;

DROP TABLE IF EXISTS `user`;
DROP TABLE IF EXISTS `country`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `country` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,            
  `wins` INT DEFAULT 0,                    
  `contests` INT DEFAULT 0,               
  `best_place` VARCHAR(100) NOT NULL,         
  `max_points` INT DEFAULT 0,           
  `automatic_qualification` BOOLEAN DEFAULT FALSE,                      
  `first_year` YEAR NOT NULL,     
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

CREATE TABLE `user` (
    `id` INT(11) NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,              
    `username` VARCHAR(50) NOT NULL UNIQUE,    
    `password` VARCHAR(255) NOT NULL,          
    `image` VARCHAR(256) DEFAULT NULL,        
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO country (id, name, wins, contests, best_place, max_points, automatic_qualification, first_year) VALUES
(1, 'Albania', 0, 20, '5th', 146, FALSE, 2004),
(2, 'Armenia', 0, 15, '4th', 249, FALSE, 2006),
(3, 'Australia', 0, 8, '2nd', 511, FALSE, 2015),
(4, 'Austria', 3, 56, '1st', 290, FALSE, 1957),
(5, 'Azerbaijan', 1, 16, '1st', 234, FALSE, 2008),
(6, 'Croatia', 0, 29, '4th', 268, FALSE, 1993),
(7, 'Cyprus', 0, 39, '2nd', 436, FALSE, 1981),
(8, 'Czech', 0, 13, '6th', 215, FALSE, 2007),
(9, 'Estonia', 1, 28, '1st', 198, FALSE, 1994),
(10, 'Finland', 1, 57, '1st', 526, FALSE, 1961),
(11, 'France', 5, 66, '1st', 499, TRUE, 1956),
(12, 'Germany', 2, 67, '1st', 385, TRUE, 1956),
(13, 'Belgium', 1, 66, '1st', 363, FALSE, 1956),
(14, 'Denmark', 3, 54, '1st', 281, FALSE, 1957),
(15, 'Georgia', 0, 17, '9th', 136, FALSE, 2007),
(16, 'Greece', 1, 46, '1st', 230, FALSE, 1974),
(17, 'Iceland', 0, 37, '2nd', 378, FALSE, 1986),
(18, 'Ireland', 7, 58, '1st', 226, FALSE, 1965),
(19, 'Israel', 4, 47, '1st', 529, FALSE, 1973),
(20, 'Italy', 3, 51, '1st', 524, TRUE, 1956),
(21, 'Latvia', 1, 26, '1st', 176, FALSE, 2000),
(22, 'Lithuania', 0, 26, '6th', 162, FALSE, 1994),
(23, 'Luxembourg', 5, 39, '1st', 142, FALSE, 1956),
(24, 'Malta', 0, 37, '2nd', 255, FALSE, 1971),
(25, 'Montenegro', 0, 13, '13th', 44, FALSE, 2007),
(26, 'Netherlands', 5, 66, '1st', 498, FALSE, 1956),
(27, 'Norway', 3, 64, '1st', 387, FALSE, 1960),
(28, 'Poland', 0, 27, '2nd', 166, FALSE, 1994),
(29, 'Portugal', 1, 56, '1st', 758, FALSE, 1964),
(30, 'San Marino', 0, 15, '19th', 77, FALSE, 2008),
(31, 'Serbia', 1, 17, '1st', 268, FALSE, 2007),
(32, 'Slovenia', 0, 30, '7th', 84, FALSE, 1993),
(33, 'Spain', 2, 65, '1st', 459, TRUE, 1961),
(34, 'Sweden', 7, 65, '1st', 583, FALSE, 1958),
(35, 'Switzerland', 3, 66, '1st', 591, FALSE, 1956),
(36, 'Ukraine', 3, 21, '1st', 631, FALSE, 2003),
(37, 'United Kingdom', 5, 68, '1st', 466, TRUE, 1957);

INSERT INTO user (id, name, username, password, image) VALUES
(1, 'Veronica', 'veru92', 'lol123', 'Czech.svg'),
(2, 'Andres', 'andres99', 'pass456', 'Austria.svg'),
(3, 'Mila', 'mila88', 'qwerty789', 'Germany.svg');

SELECT * FROM country;
