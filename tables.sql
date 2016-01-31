drop database if exists article;

create database article;
use article;

CREATE TABLE publishers (
	id INTEGER not null AUTO_INCREMENT,
	name VARCHAR(50),
	email VARCHAR(50) not null UNIQUE,
	password VARCHAR(50),
	PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE subscribers (
	id INTEGER not null AUTO_INCREMENT,
	name VARCHAR(50),
	email VARCHAR(50) not null UNIQUE,
	password VARCHAR(32),
	regid TEXT,
	PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE categories (
	id INTEGER not null AUTO_INCREMENT,
	name VARCHAR(50),
	PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE subscriptions (
	subscriber INTEGER,
	category INTEGER,
	PRIMARY KEY (subscriber, category),
	FOREIGN KEY (subscriber) REFERENCES subscribers(id),
	FOREIGN KEY (category) REFERENCES categories(id)
) ENGINE=INNODB;

CREATE TABLE articles (
	id INTEGER not null AUTO_INCREMENT,
	publisher INTEGER not null,
	category INTEGER not null,
	title VARCHAR(100) not null,
	content MEDIUMTEXT not null,
	timestamp BIGINT not null,
	PRIMARY KEY (id),
	FOREIGN KEY (publisher) REFERENCES publishers(id),
	FOREIGN KEY (category) REFERENCES categories(id)
) ENGINE=INNODB;

INSERT INTO categories VALUES 
(1, "Arts and Entertainment"),
(2, "Computers and Electronics"),
(3, "Finance and Business"),
(4, "Food"),
(5, "Hobbies and Crafts"),
(6, "Travel"),
(7, "Sports and Fitness");
/*(8, "Relationship"),
(9, "Personal Care and Style"),
(10, "Philosophy and Religion"),
(11, "Holidays and Traditions"),
(12, "Education and Communications"),
(13, "Family Life"),
(14, "Home and Garden"),
(15, "Work World"),
(16, "Youth"),
(17, "Cars and Other Vehicles"),
(18, "Health"),
(19, "Pets and Animals");
*/

INSERT INTO publishers VALUES 
(1, "James", "james@example.com", MD5("james")),
(2, "David", "david@example.com", MD5("david")),
(3, "Robert", "robert@example.com", MD5("robert")),
(4, "Paul", "paul@example.com", MD5("paul"));

INSERT INTO articles VALUES
(1, 1, 2, "Building the VW of PC's", "That was another thing. They hated having to translate their work into dumbed-down metaphors for the shiny shoe set – the meddlesome lawyers, media scribblers, and potential corporate sponsors who came through wanting to \"understand\" without doing the hard work of paying attention. Oh, god. This was just one more reason that Francis Benoit was glad he was working here at the La Honda Research Center and not out there in some corporate start-up, because despite all the roll-up-your-shirtsleeves myths and stereotypes, when you got right down to it, working for a start-up meant he'd spend 80 percent of his time doing complete bullshit – chasing VC money, writing technical documentation, hiring people – and all of it involved dumbing down your work. And the meetings! To participate in that game would be a waste of god-given talent, it would be a crime against his very own nature. Francis Benoit could just see himself cooped up in some office park, suffocating on his own unvented thoughts, poisoning himself, just to prove something to the shiny shoe set.", 1454233636126),
(2, 1, 4, "The Trouble with Fries", "In 1954, a man named Ray Kroc, who made his living selling the five-spindle Multimixer milkshake machine, began hearing about a hamburger stand in San Bernardino, California. This particular restaurant, he was told, had no fewer than eight of his machines in operation, meaning that it could make forty shakes simultaneously. Kroc was astounded. He flew from Chicago to Los Angeles, and drove to San Bernardino, sixty miles away, where he found a small octagonal building on a corner lot. He sat in his car and watched as the workers showed up for the morning shift. They were in starched white shirts and paper hats, and moved with a purposeful discipline. As lunchtime approached, customers began streaming into the parking lot, lining up for bags of hamburgers. Kroc approached a strawberry blonde in a yellow convertible.", 1454233620689),
(3, 2, 3, "Financial Patent Quality: Finance Patents After State Street", "In the past two decades, patents of inventions related to financial services (\"finance patents\"), as well as litigation around these patents, have surged. One of the repeated concerns voiced by academics and practitioners alike has been about the quality of these patents, in particular, and business method patents more generally. Because so much of the prior work in these areas has not been patented, concerns have been expressed as to the extent to which the awards reflect this knowledge. Inspired by these issues, this paper empirically examines the quality of finance patents in the years after the landmark litigation between State Street Bank and Signature Financial Group. We show that relative to two sets of comparison groups, finance patents in aggregate cite fewer non-patent publications and especially fewer academic publications. This finding holds across the major assignee groups. In addition, it appears that patents assigned to individuals and associated with non-practicing entities (NPEs) cite less academic work than those assigned to non-NPE corporations. While not statistically significant due to the small number of academic citations in finance patents, we observe qualitatively similar patterns of under-citation when we restrict our analysis to finance patents held by individuals and NPEs, as opposed to non-NPE corporations. These findings raise questions about the quality of finance patents. We also explore litigated finance patents and discuss how the results here may reflect differences in the quality of finance patents relative to other areas. We find that, as earlier work has suggested, finance patents are more likely to be litigated than non-finance patents, but increased academic citations appear to reduce that possibility relative to others. Collectively, these findings raise important questions about the quality of finance patents and the proliferation of litigation in this domain.", 1454233610698),
(4, 3, 7, "Angelique Kerber Upsets Serena Williams to Win Australian Open", "At the Australian Open on Saturday, all that stood between Serena Williams and Steffi Graf was Angelique Kerber, who took 33 majors to reach her first Grand Slam final. Kerber was trying to become the first German to win a women’s major since Graf won in 1999. Williams was trying to join Graf as a 22-time major winner in singles.

Williams, the world No. 1, was the defending champion and a six-time titlist here. But in the final it was as if she were playing singles against a doubles team of Kerber and Graf. As strong as Williams is, she could not quite push through the pressure of history and a free-swinging Kerber, who pulled off the 6-4, 3-6, 6-4 upset at Rod Laver Arena.", 1454233597145),
(5, 4, 1, "Drawing Basics: What Masters DO that Amateurs DON’T", "Carol Leather adores her granddaughter and wanted to freeze that young energetic spirit. But when she created a portrait of six-year-old Beth, it laid lifeless on the page, flat, out of proportion and missing the personality that this perky child exudes. It didn’t even look like a little girl; Carol had aged the portrait.

Here are the common drawing mistakes Carol made that you might be making, too:

1. She put the eyes in the center of the face, which isn’t where eyes line up on a child’s face.
• As people age, eyes move to different positions.
• Carol’s drawing proportions were off, so the likeness eluded her.

2. Carol used just two pencils for the hair, instead of a wide range multifarious tones found in natural hair.
• Even blonde hair has super dark values.
• In her final portrait she used 12-18 pencils to create depth in hair.

3. She used just one pencil for the skin tones, which makes the face look flat.
• In her second portrait, she used 12-18 pencils to help the face take on dimension.

4. She used white drawing paper.
• It takes 200% longer to draw portraits on white and results tend to be wimpy.
• Your portrait paper needs to be in harmony with skin tones.
• Clothing needs to be in harmony with the paper.

5. Her photo reference didn’t capture the child’s personality.
• It’s tricky to get great shots of a moving target, like kids, but there are some really cool ways to make that happen!
• In my online art workshops, I share numerous secrets for shooting better reference photos for GREAT portraits.", 1454233584156);


/*INSERT INTO subscribers VALUES (1, "Anand Gupta", "anandkg@iitk.ac.in", MD5("anand"), "dzfsdfds");

INSERT INTO subscriptions VALUES (1, 10), (1, 5), (1, 19); 
*/
