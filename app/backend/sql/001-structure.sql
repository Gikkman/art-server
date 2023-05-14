CREATE TABLE art_state (
	"id"	INTEGER NOT NULL,
	"state"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("id")
);
CREATE TABLE art (
	"scryfallIllustrationId"	TEXT NOT NULL,
	"state_id"	INTEGER NOT NULL,
	CONSTRAINT "fk_art_state" FOREIGN KEY("state_id") REFERENCES "art_state"("id"),
	PRIMARY KEY("scryfallIllustrationId")
);