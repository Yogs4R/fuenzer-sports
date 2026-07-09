# Tournament Rules: World Cup 2026

This document serves as the official source of truth for the World Cup 2026 tournament format and rules, derived from official FIFA and FOX Sports guidelines. The Monte Carlo engine must strictly adhere to these rules during simulations.

## 1. Tournament Format
- **Total Teams:** 48 teams.
- **Group Stage:** 12 groups (Group A to Group L) consisting of 4 teams each.
- **Knockout Stage Qualification:** 32 teams advance to the knockout rounds.
  - The top two (2) teams from each of the 12 groups advance automatically (24 teams).
  - The eight (8) best third-placed teams across all groups also advance (8 teams).
- **Match Points:** 
  - Win: 3 points
  - Draw: 1 point
  - Loss: 0 points

## 2. Group Stage Tie-Breaking Criteria
If two or more teams in the same group are equal on points after the completion of the group stage, the following criteria shall be applied in order:

### Step One (Head-to-Head)
1. Greatest number of points obtained in the group matches between the teams concerned.
2. Superior goal difference resulting from the group matches between the teams concerned.
3. Greatest number of goals scored in all group matches between the teams concerned.

### Step Two (Overall Group Performance)
*If teams are still tied after Step One:*
4. Superior goal difference in all group matches.
5. Greatest number of goals scored in all group matches.
6. Highest team conduct score (Fair Play) relating to the number of yellow and red cards obtained.

### Step Three (Ranking)
*If teams are still tied after Step Two:*
7. Ranked according to the most recent published edition of the FIFA/Coca-Cola Men's World Ranking.

## 3. Best Third-Placed Teams Tie-Breaking
The eight (8) best third-placed teams are determined by comparing their performance across all groups using the following criteria in order:
1. Greatest number of points obtained in all group matches.
2. Goal difference resulting from all group matches.
3. Greatest number of goals scored in all group matches.
4. Highest team conduct score (Fair Play).
5. Highest position in the FIFA/Coca-Cola Men's World Ranking.

## 4. Knockout Stage Rules
- **Extra Time:** If a match is tied after 90 minutes of regulation, two 15-minute halves of Extra Time will be played.
- **Penalty Shootout:** If the match remains tied after Extra Time, the winner is determined by a penalty shootout (starting with 5 penalties per team).

## 5. Official Fixed Bracket Map for the Round of 32 - FIFA World Cup 2026

This document contains the fixed bracket mapping a total of **16 matches** (32 teams) in the Round of 32, in accordance with official FIFA regulations.

---

### 1. Group Winners vs. Best 3rd-Place Teams Pathway (8 Matches)
The eight group winners listed below are locked to face one of the best 3rd-place teams. The specific opponent is determined based on the group letter combinations of the 8 qualifying third-place teams (governed by *FIFA's Annex C Matrix* to prevent teams from rematching opponents from their original group):

* **Winner Group A** vs. 3rd Place Group C / E / F / H
* **Winner Group B** vs. 3rd Place Group A / C / E / F
* **Winner Group D** vs. 3rd Place Group B / F / G / I
* **Winner Group E** vs. 3rd Place Group A / B / C / D
* **Winner Group G** vs. 3rd Place Group I / J / K / L
* **Winner Group I** vs. 3rd Place Group G / H / J / K
* **Winner Group K** vs. 3rd Place Group D / G / H / I
* **Winner Group L** vs. 3rd Place Group D / E / I / J

*(AI Agent Note: Why not use rankings 1-8? FIFA deliberately avoids pairing 3rd-place teams based on their exact mini-table ranking order (e.g., Winner A vs. 1st Ranked 3rd-Place Team) to prevent match manipulation in the final group stage games and to ensure geographical/rest schedule security).*

---

### 2. Group Winners vs. Runners-up Pathway (4 Matches)
The four matches in this pathway pair the remaining group winners directly against the runners-up of their designated partner groups, which have been locked since the start of the tournament:

* **Winner Group C** vs. Runner-up Group F
* **Winner Group F** vs. Runner-up Group C
* **Winner Group H** vs. Runner-up Group J
* **Winner Group J** vs. Runner-up Group H

---

### 3. Head-to-Head Runners-up Pathway (4 Matches)
The remaining four matches strictly pit eight group runner-up teams against one another:

* **Runner-up Group A** vs. Runner-up Group B
* **Runner-up Group D** vs. Runner-up Group E
* **Runner-up Group G** vs. Runner-up Group H
* **Runner-up Group K** vs. Runner-up Group L

---

### 4. Team Allocation Recap (AI Agent Logic Verification)
To ensure your agent's calculations run validly without any missed or duplicated teams, here is the distribution summary:

| Match Slot Category | Total Matches | Total Teams Involved |
| :--- | :---: | :---: |
| Group Winner vs. Best 3rd-Place | 8 Matches | 8 Group Winners + 8 3rd-Place Teams |
| Group Winner vs. Group Runner-up | 4 Matches | 4 Group Winners + 4 Group Runners-up |
| Group Runner-up vs. Group Runner-up | 4 Matches | 8 Group Runners-up |
| **GRAND TOTAL** | **16 Matches** | **32 Qualified Teams** |

