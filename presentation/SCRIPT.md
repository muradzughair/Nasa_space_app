# Analog Atlas: pitch script

About 4 minutes at a calm pace (around 540 spoken words). **Bold** = say it with weight. `[→]` = next slide.
Wait for each camera flight to land before you start talking; it takes about two seconds and gives you a breath.

---

## 1 · The problem (≈ 35 s)

NASA is going back to the Moon, and on to Mars. And before any mission goes, it **rehearses on Earth**.

NASA tests its rovers, instruments and crews at **analog sites**: places on Earth that look and behave like the Moon or Mars. You can see a few on the globe: an Arctic crater in Canada, lava fields in Arizona, the Atacama Desert, Río Tinto in Spain.

Choosing the right site decides what a test actually proves. But today, candidate sites are found with **satellite data**, and satellites miss what matters at ground level. The only way to check is to **send people there**, which is slow and costly.

`[→]`

## 2 · The evidence (≈ 35 s)

And the data shows it.

Río Tinto is a **classic Mars analog**. Yet in a satellite-based model it scores **only 5%**, because its acid river is invisible inside a **50 km** data cell. The dashed circle on the map is one of those cells.

A review of **33 analog sites** found **no clearly defined criteria** for choosing or evaluating them.

And checking on the ground is expensive: a professional field check costs **€32.40 per point**, in the EU's own land survey. That's in accessible Europe. Analog sites are in the Arctic and the desert.

`[→]`

## 3 · Our solution (≈ 35 s)

So we built **Analog Atlas**. It finds the site, checks it with locals, and fixes the data.

A researcher picks a target on the **Moon or Mars**. Our model scores **every place on Earth** against it, and explains each score: what matches, what doesn't, and what is only an estimate. People who know a shortlisted place can **verify it**, and reviewed evidence **corrects the record**.

Every score is driven by **NASA data**: MODIS, NASA POWER, and LOLA and MOLA terrain from the Moon and Mars.

And it works: out of **92,172 places on Earth**, known analogs like Craters of the Moon rank in the **top 0.1%**, and the Amazon rainforest lands in the **bottom 1%**.

`[→]`

## 4 · The loop (≈ 35 s)

Here's how it works in practice.

**One**, a researcher sends a verification request for an Earth site that matches their Moon or Mars target. The app drafts the questions from the **weakest data**, the parts we had to estimate.

**Two**, local contributors (a geologist, a guide, a student who lives there) watch the **rover walkthrough** of that exact area and **correct what's wrong**, with photos.

**Three**, the researcher reviews: they **accept** the evidence or **ask for more**.

**Four**, the rover test team tests the ground in our **simulator**, before anyone travels.

`[→]`

## 5 · Why a rover (≈ 30 s)

Why a rover? Because ground mistakes are **expensive**.

In 2009 NASA's **Spirit** rover got stuck in soft soil on Mars, right here, and never drove out. JPL had to rebuild that soil on Earth to plan its escape.

Our simulator drives **NASA rover models**, like Perseverance and Curiosity, on **real ground anywhere on Earth**, at Earth gravity and at **Mars or Moon gravity side by side**.

**Locals** use it to check the landscape, **researchers** use it to screen sites, and **test teams** use it to plan routes.

`[→]`

## 6 · Impact and cost (≈ 40 s)

So what does it cost? **A year of Analog Atlas costs less than one site visit.**

Running it costs about **$28 a month**: $25 for the database, a dollar for hosting, up to $2 for videos and photos. The scoring and the rover run on the **user's own device**, so they cost us **nothing**. That's about **$340 a year**.

Compare that to one site visit: two scientists for five days is **$1,780 in daily expenses alone, before flights**.

Checking with local volunteers is **92% cheaper** per check: **€2.60 instead of €32.40**. And every flight we avoid saves about **2.3 tonnes of CO₂** per person.

`[→]`

## 7 · What's next (≈ 25 s)

Next, we want researchers to choose **any spot on Mars** as a target, the way they already can on the Moon. We'll add a **shared backend** with accounts and moderation, rover ground on the **Moon and Mars**, and mineral maps from NASA's **EMIT** instrument.

Scan the code to try Analog Atlas. **Thank you.**

---

## Numbers to have ready

| Number | What it is | Source |
| --- | --- | --- |
| 5% | Río Tinto's score for acid-sulfate Mars in our model (bottom fifth of all land) | Our model; Río Tinto as analog: Fernández-Remolar et al. 2005 |
| 33 | Analog sites reviewed, "no clearly defined and followed criteria" | Preston & Dartnell 2014, *Int. J. Astrobiology* |
| €32.40 vs €2.60 | Cost per ground point: professional EU survey (LUCAS) vs trained volunteers (FotoQuest Go) → 92% cheaper | Laso Bayas et al. 2020, *Land* |
| 92,172 | Land cells on Earth our model scores (0.5°, about 50 km each) | Our grid |
| top 0.1% / bottom 1% | Craters of the Moon vs lunar maria (54%); Amazon vs modern Mars (3%) | Our model |
| $28 / month | $25 Supabase + $1 hosting and domain + ≤ $2 Cloudflare R2 storage | 2026 list prices |
| $1,780 | 2 people × 5 days × $178 US federal per diem; flights not included | US GSA, FY2026 |
| 2.3 t CO₂ | One 10,000 km round trip × 0.117 kg CO₂e per passenger-km | UK DESNZ 2025 |

## Likely questions

**"What does 'tested on 92,172 places' mean?"**
We split all land on Earth into 92,172 squares of about 50 km and scored every one. Then we checked where famous analog sites land in that ranking. Craters of the Moon is in the top 0.1% for the Moon's lava plains, the Atacama in the top 0.5% for Mars. Places that should score low, like the Amazon, land at the bottom. That's how we know the model points the right way.

**"Isn't 5% for Río Tinto a failure of your own model?"**
Yes, and that's the point. Any model built on global satellite data has this blind spot. It's exactly why we added the local verification step.

**"What does a 76% score mean?"**
That a place is among the most similar on Earth, compared with other places on Earth. It doesn't mean "76% like the Moon". Gravity, atmosphere and radiation are listed on every card but never scored, since no place on Earth differs on them.

**"How do you stop bad or fake contributions?"**
Nothing counts until a reviewer accepts it, and accepted evidence never silently changes the score. Research (See et al. 2013) shows volunteers are useful but less accurate than experts, which is why the review step exists.

**"Is the rover simulation accurate?"**
It's a screening tool, not a validated physics model. The terrain is real at 30 m, but the soil model is simplified, and detail below about 60 m is synthetic. It's for seeing a site and catching obvious problems before travel; real rover performance still needs field tests.

**"What happens when you scale up?"**
At 10 times the use (2,000 requests a month) it stays under $50 a month. Deployment is free. Rebuilding the data is free with a NASA Earthdata login and takes 1–2 hours on a laptop. Pre-recorded rover videos for the top 1% of places would add about $3.50 a month.

**"Why not just use the satellites better?"**
Some features (an acid stream, a salt crust, how soft the ground is) are smaller than any global dataset can see. Global land cover maps already disagree widely, and the fix in the literature is ground observations (Fritz et al. 2017).
