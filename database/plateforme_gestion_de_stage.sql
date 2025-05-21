
CREATE TABLE Utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    mdps TEXT NOT NULL,
    token_confirmation VARCHAR(255),
    email_verifie BOOLEAN DEFAULT false,
    reset_token VARCHAR(255),
    reset_token_expire DATETIME,
    role ENUM('etudiant', 'entreprise', 'chef_dept', 'admin') NOT NULL
);

CREATE TABLE Etudiant (
    id_etud INT PRIMARY KEY,
    universite VARCHAR(100),--default UMBB
    specialite VARCHAR(100),
    niveau VARCHAR(50),  --L1 L2 L2 M1 M2
    departement VARCHAR(100),  --'Informatique', 'Mathematiques', 'Physique', 'Agronomie', 'SNV', 'Biologie', 'STAPS', 'Chimie'
    matricule VARCHAR(20),
    FOREIGN KEY (id_etud) REFERENCES Utilisateur(id) ON DELETE CASCADE
);

CREATE TABLE Entreprise (
    id_entr INT PRIMARY KEY,
    adr VARCHAR(255),
    tel VARCHAR(50),
    secteur VARCHAR(100),
    FOREIGN KEY (id_entr) REFERENCES Utilisateur(id) ON DELETE CASCADE
);


CREATE TABLE ChefDepartement (
    id_chef INT PRIMARY KEY,
    universite VARCHAR(100),--default UMBB
    departement VARCHAR(100), 
    FOREIGN KEY (id_chef) REFERENCES Utilisateur(id) ON DELETE CASCADE
);

CREATE TABLE Administrateur (
    id_adm INT PRIMARY KEY,
    universite VARCHAR(100), --default UMBB
    FOREIGN KEY (id_adm) REFERENCES Utilisateur(id) ON DELETE CASCADE
);


CREATE TABLE offrestage (
    id_offre INT AUTO_INCREMENT PRIMARY KEY,
    entr INT,
    titre VARCHAR(100),
    domaine VARCHAR(100),
    duree VARCHAR(50),
    date_debut DATE,
    date_fin DATE,
    missions TEXT,
    descr TEXT,
    competencesRequises TEXT,
    FOREIGN KEY (entr) REFERENCES Entreprise(id_entr) ON DELETE SET NULL
);

CREATE TABLE Candidature (
    candidat INT,
    offre INT,
    date_cand DATE NOT NULL, -- en attente, accepte , refuse
    etat_cand VARCHAR(50) DEFAULT 'en attente',  -- en attente, accepte , refuse     
    etat_sta VARCHAR(50) DEFAULT NULL,        --en cours abandonne termine       
    cv VARCHAR(255),                                  
    PRIMARY KEY (candidat, offre),
    FOREIGN KEY (candidat) REFERENCES Etudiant(id_etud) ON DELETE CASCADE,
    FOREIGN KEY (offre) REFERENCES offrestage(id_offre) ON DELETE CASCADE
);

CREATE TABLE favoris (
    etudiant INT,
    offre_fav INT,
    PRIMARY KEY (etudiant, offre_fav),
    FOREIGN KEY (etudiant) REFERENCES utilisateur(id) ON DELETE CASCADE,
    FOREIGN KEY (offre_fav) REFERENCES offrestage(id_offre) ON DELETE CASCADE
);

CREATE TABLE Evaluation (
    evaluateur INT,
    evalue INT,
    id_offre INT,
    note_comport FLOAT,
    note_adapt FLOAT,
    note_esprit_equipe FLOAT,
    note_qual_trav FLOAT,
    nb_absences INT,
nb_justification INT,
commentaire STRING
    date_soumission DATE,
    PRIMARY KEY (evaluateur, evalue, id_offre),
    FOREIGN KEY (evaluateur) REFERENCES Entreprise(id_entr) ON DELETE CASCADE,
    FOREIGN KEY (evalue) REFERENCES Etudiant(id_etud) ON DELETE CASCADE,
    FOREIGN KEY (id_offre) REFERENCES offrestage(id_offre) ON DELETE CASCADE
);

CREATE TABLE Notification (
  id_notif INT AUTO_INCREMENT PRIMARY KEY,
  expediteur INT NOT NULL,
  destinataire INT NOT NULL,
  msg TEXT NOT NULL,
  type_notif VARCHAR(50) NOT NULL,
  date_creation DATETIME DEFAULT CURRENT_TIMESTAMP,
  lu BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (expediteur) REFERENCES Utilisateur(id),
  FOREIGN KEY (destinataire) REFERENCES Utilisateur(id)
);

CREATE TABLE Document (
  id_doc INT AUTO_INCREMENT PRIMARY KEY,
  exped_doc INT NOT NULL,
  destin_doc INT NOT NULL,
  type VARCHAR(100) NOT NULL,
  chemin VARCHAR(255) NOT NULL,
  associated_offer INT NULL,
  date_envoi DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exped_doc) REFERENCES Utilisateur(id),
  FOREIGN KEY (destin_doc) REFERENCES Utilisateur(id)
);
