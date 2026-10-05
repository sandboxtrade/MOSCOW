CREATE TABLE player_progress (account_id TEXT PRIMARY KEY,onboarding_step TEXT NOT NULL DEFAULT 'MEET_GUIDE',phone_owned INTEGER NOT NULL DEFAULT 0,tutorial_completed INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL,FOREIGN KEY (account_id) REFERENCES accounts(id));
CREATE TABLE catalog_items (id TEXT PRIMARY KEY,type TEXT NOT NULL,name TEXT NOT NULL,price_rub INTEGER NOT NULL,enabled INTEGER NOT NULL DEFAULT 1,metadata TEXT);
CREATE TABLE inventory (id TEXT PRIMARY KEY,account_id TEXT NOT NULL,item_id TEXT NOT NULL,acquired_at TEXT NOT NULL,metadata TEXT,FOREIGN KEY (account_id) REFERENCES accounts(id),FOREIGN KEY (item_id) REFERENCES catalog_items(id));
CREATE INDEX idx_inventory_account ON inventory(account_id);
CREATE INDEX idx_inventory_item ON inventory(item_id);
CREATE TABLE purchases (id TEXT PRIMARY KEY,account_id TEXT NOT NULL,item_id TEXT NOT NULL,price_rub INTEGER NOT NULL,balance_class TEXT NOT NULL,transaction_id TEXT,created_at TEXT NOT NULL,FOREIGN KEY (account_id) REFERENCES accounts(id),FOREIGN KEY (item_id) REFERENCES catalog_items(id),FOREIGN KEY (transaction_id) REFERENCES transactions(id));
INSERT INTO catalog_items (id,type,name,price_rub,enabled,metadata) VALUES ('starter_phone','PHONE','Бюджетный смартфон',15000,1,'{"tier":"starter"}');
