<!---------- INFOS ----------
- Pour qu'un ticket puisse être intégré au sprint il doit être "prêt" [voir convention](https://www.notion.so/timothyalcaide/Un-ticket-pr-t-cc6f90c9c20043fba6ac545568f09294).
- Un ticket prêt doit être **claires**, **réalisables** et **vérifiables.**
-->

# L'expression des besoins

<!-- Ne jamais rédiger un ticket à partir de sa solution technique, partir des besoins utilisateur ! -->

## User story

NOM_DU_PERSONA souhaite
TACHE_A_REALISER afin de
BENEFICE

<!---------- INFOS ----------
Les user stories sont une bonne manière d'exprimer rapidement un besoin utilisateur.
Ce sont de petites histoires utilisateurs détaillées

**Exemple d'US**
En tant qu’utilisateur, je souhaite pouvoir récupérer le mot de passe sur mon compte, afin de pouvoir accéder à mon compte en cas d’oubli du mot de passe.*

Critères à respecter 👇

- **Indépendant** : Il faut éviter d’introduire des dépendances entre chaque User Story.
- **Négociable** : Une User story n’est pas figée dans le temps, donc il n’est pas nécessaire d’inclure tous les détails.
- **Valeur** : Chaque User Story doit avoir une valeur métier (business value) qui représente l’intérêt de la fonctionnalité pour les utilisateurs.
- **Estimable** : Les User Stories doivent être explicites, pour pouvoir être par la suite estimées au niveau de leur difficulté par l’équipe de développement.
- **Succinct** : L’expression d’une User Story doit être faite avec un nombre restreint de mots.
- **Testable** : Une User story n’est viable que si elle est testable.
------------------------------>

## Job to be done

Quand SITUATION,
En tant que PERSONA,
Je veux MOTIVATION (donner_les_frustration_sous_jacentes)
afin de RESULTAT_SOUHAITE

<!---------- INFOS ----------
Donner le contexte de ce job.
Quel est le problème que l'on résout ? Qu'est-ce qui le motive à adopter cette fonctionnalité ?
**Exemple**: Quand un nouveau commentaire est posté, un utilisateur souhaite être informé immédiatement pour pouvoir y répondre rapidement, sans avoir besoin de se connecter régulièrement.
------------------------------>

## Ressources complémentaires

<!-- Cocher les ressources complémentaires et les ajouter.-->

- [ ] Scénario
- [ ] Storyboard
- [ ] Mockup
- [ ] Diagramme de contexte
- [ ] Diagramme d'activité
- [ ] Autre

# Critères d’acceptations

## Orienté scénario

<!-- Si existe
NOM_DU_COMPORTEMENT_DECRIT

- Étant donné : l’état_initial_du_scénario
- Quand : action_spécifique_que_l’utilisateur_effectue
- Ensuite : le_résultat_de_l’action_dans_Quand
- Et : utilisé_pour_continuer_l’une_des_trois_déclarations_précédentes
- ...
-->
<!-- Sinon
Aucun
-->

<!---------- INFOS ----------
**Scénario "Mot de passe oublié"**
- **Given:** L’utilisateur a accédé à la page de connexion
- **When** : L’utilisateur a sélectionné l’option de *mot de passe oublié*
- **And** : entré un e-mail valide pour recevoir un lien pour la récupération du mot de passe
- **Then** : Le système a envoyé le lien vers l’e-mail entré
- **Given :** L’utilisateur a reçu le lien par e-mail
- **When :** l’utilisateur a parcouru le lien reçu dans l’e-mail
- **Then :** Le système permet à l’utilisateur de définir un nouveau mot de passe
------------------------------>

## Orienté règles

<!-- Si existe
**NOM_DU_SCENARIO**

- Règle_1
- Règle_2
- ...
-->
<!-- Sinon
Aucun
-->

<!---------- INFOS ----------
La forme orientée règles implique qu’il existe un ensemble de règles qui décrivent le comportement d’un système. Sur la base de ces règles, vous pouvez dessiner des scénarios spécifiques.

**Exemple "Recherche de base"**
- Le champ de recherche est placé sur la barre supérieure
- La recherche démarre une fois que l’utilisateur clique sur « Rechercher »
- Le champ contient un espace réservé avec un texte en gris : «Où allez-vous ?»
- L’espace réservé disparaît une fois que l’utilisateur commence à taper
- La recherche est effectuée si un utilisateur saisit une ville, un nom d’hôtel, une rue ou tous
- La recherche est en anglais, français, allemand et ukrainien
- L’utilisateur ne peut pas taper plus de 200 symboles
- La recherche ne prend pas en charge les symboles spéciaux (caractères). Si l’utilisateur a tapé un symbole spécial, affichez le message d’avertissement : « L’entrée de recherche ne peut pas contenir de symboles spéciaux.»
------------------------------>

# Contexte

<!-- Si aucun :
Aucun contexte associé 🤥
-->
<!-- Sinon compléter 👇
Thème associé : IDENTIFIANT_THEME
Epic associée : IDENTIFIANT_EPIC
- Travaux de recherche
- L'importance du problème résolu
- Contraintes à ne pas négliger
- ...
-->

<!---------- INFOS ----------
Cette partie permet de comprendre dans quel contecte ce ticket s'inscrit.
Les travaux de recherches, le périmètre, les risques liés, les contraintes à ne pas négliger, l'importance du problème résolu, les opportunités...
------------------------------>

/label ~feature
