CREATE DATABASE IF NOT EXISTS ProjectPart1;
USE ProjectPart1;

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
(12, 'Germany', 2, 67, '1st', 385, TRUE, 1956);

INSERT INTO user (id, name, username, password, image) VALUES
(1, 'Veronica', 'veru92', 'lol123', 'Czech.svg'),
(2, 'Andres', 'andres99', 'pass456', 'Austria.svg'),
(3, 'Mila', 'mila88', 'qwerty789', 'Germany.svg');

SELECT * FROM country;
