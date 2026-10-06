(function(global){
'use strict';
const E = global.Algebra2Engine;
if(!E) throw Error('Algebra2Engine must load before Lesson 90.');
const {esc,math,pow,frac,root,panel,callout,choice,makeChoices} = E.helpers;
const Q = (id,section,label,skill,type,prompt,rest) => ({id,section,label,skill,type,prompt,...rest});

const topics = [
{
 id:'difference',
 title:'A product with opposite signs',
 short:'Multiply first, then notice the pattern',
 intro:'When the signs inside the two binomials are different, the middle terms cancel.',
 body:
  `<p>The expression <strong>(x + a)(x − a)</strong> is a special product. When you distribute, the middle terms are equal in size but opposite in sign, so they add to zero.</p>${panel('(x + a)(x − a) = x<sup>2</sup> − a<sup>2</sup>','This is the standard difference-of-two-squares form.')}<p>That means the answer is the first quantity squared minus the second quantity squared.</p>`,
 steps:[
  ['Write the product long way.', math('(x + a)(x − a) = x·x − x·a + a·x − a·a')],
  ['Combine the middle terms.', math('−xa + ax = 0')+' so the middle disappears.'],
  ['Finish the simplification.', math('x<sup>2</sup> − a<sup>2</sup>')+' is the final result.']
 ],
 after:`${panel('(x + b)(x − b) = x<sup>2</sup> − b<sup>2</sup><br>(x + c)(x − c) = x<sup>2</sup> − c<sup>2</sup><br>(x + y)(x − y) = x<sup>2</sup> − y<sup>2</sup>')}${callout('Watch the signs','A difference of two squares factors as '+math('(m+n)(m-n)')+', not '+math('(m-n)(m-n)')+'.')}`,
 mini:{prompt:'Simplify '+math('(x + 5)(x − 5)')+'.',options:['x<sup>2</sup> − 25','x<sup>2</sup> + 25','x<sup>2</sup> − 10x + 25'],correct:0,explain:'The middle terms cancel, leaving x² − 5² = x² − 25.'}
},
{
 id:'factor',
 title:'Run the pattern backward',
 short:'Factoring a difference of squares',
 intro:'If both terms are perfect squares and they are separated by subtraction, try the difference-of-two-squares pattern.',
 body:
  `<p>To factor <strong>a<sup>2</sup> − b<sup>2</sup></strong>, take the square roots of the two terms, then write one factor with a plus and one with a minus.</p>${panel('a<sup>2</sup> − b<sup>2</sup> = (a + b)(a − b)','The signs inside the factors must be different.')}<p>This works for numbers, variables, and larger algebraic expressions.</p>`,
 steps:[
  ['Recognize the two squares.', math('64c<sup>4</sup> = (8c<sup>2</sup>)<sup>2}')+' and '+math('25d<sup>2</sup> = (5d)<sup>2}')+'.'],
  ['Take the square roots.', 'Use '+math('8c<sup>2</sup>')+' and '+math('5d')+'.'],
  ['Write the factors.', math('(8c<sup>2</sup> + 5d)(8c<sup>2</sup> − 5d)')+'.']
 ],
 after:`${callout('Not every subtraction is a difference of squares',math('x<sup>2</sup> − 8bx + 12b<sup>2</sup>')+' is a trinomial, so it must be factored by finding two numbers whose product is '+math('12b<sup>2</sup>')+' and whose sum is '+math('−8b')+'.')}`,
 mini:{prompt:'Factor '+math('x<sup>2</sup> − y<sup>2</sup>')+'.',options:['(x + y)(x − y)','(x − y)<sup>2</sup>','x(x − y)'],correct:0,explain:'A difference of two squares factors as one plus-factor and one minus-factor.'}
},
{
 id:'complicated',
 title:'Rewrite each term as a square first',
 short:'Complicated cases',
 intro:'Sometimes the expression does not look like a difference of squares at first glance, but each term can be rewritten as a perfect square.',
 body:
  `<p>For example, <strong>16x<sup>4</sup> − 25y<sup>6</sup></strong> can be rewritten as <strong>(4x<sup>2</sup>)<sup>2</sup> − (5y<sup>3</sup>)<sup>2</sup></strong>. Once you can see the squares, the same factoring rule works.</p>${panel('16x<sup>4</sup> − 25y<sup>6</sup> = (4x<sup>2</sup> + 5y<sup>3</sup>)(4x<sup>2</sup> − 5y<sup>3</sup>)')}<p>The key step is identifying the square root of each term correctly.</p>`,
 steps:[
  ['Rewrite each term.', math('16x<sup>4</sup> = (4x<sup>2</sup>)<sup>2</sup>')+' and '+math('25y<sup>6</sup> = (5y<sup>3</sup>)<sup>2}')+'.'],
  ['Apply the pattern.', math('A<sup>2</sup> − B<sup>2</sup> = (A+B)(A−B)')+'.'],
  ['Substitute back.', math('(4x<sup>2</sup> + 5y<sup>3</sup>)(4x<sup>2</sup> − 5y<sup>3</sup>)')+'.']
 ],
 after:`${callout('Helpful rewrite','Even a single-variable example such as '+math('x<sup>2</sup> − 64')+' can be seen as '+math('x<sup>2</sup> − 8<sup>2</sup>')+', so it factors as '+math('(x+8)(x-8)')+'.')}`,
 mini:{prompt:'Which expression is a correct factorization of '+math('81a<sup>4</sup> − 49b<sup>2</sup>')+'?',options:['(9a<sup>2</sup> + 7b)(9a<sup>2</sup> − 7b)','(9a<sup>4</sup> + 7b<sup>2</sup>)(9a<sup>4</sup> − 7b<sup>2</sup>)','(9a<sup>2</sup> − 7b)<sup>2</sup>'],correct:0,explain:'Rewrite as (9a²)² − (7b)², then factor as a difference of squares.'}
},
{
 id:'hyperbola',
 title:'Read the graph form of a horizontal hyperbola',
 short:'Graphing review',
 intro:'A horizontal hyperbola opens left and right.',
 body:
  `${panel(frac('(x − h)<sup>2</sup>','a<sup>2</sup>')+' − '+frac('(y − k)<sup>2</sup>','b<sup>2</sup>')+' = 1','Center: (h, k). Vertices: (h ± a, k). The guiding rectangle has height 2b and width 2a.')}<p>The center comes from the numbers inside the parentheses, but watch the signs carefully. A plus inside a parenthesis means the center coordinate is negative.</p>`,
 steps:[
  ['Find the center.', math(frac('(x−1)<sup>2</sup>','9')+' − '+frac('(y+3)<sup>2</sup>','4')+' = 1')+' has center '+math('(1, −3)')+'.'],
  ['Find a and b.', math('a = 3')+' and '+math('b = 2')+' because '+math('a<sup>2</sup> = 9')+' and '+math('b<sup>2</sup> = 4')+'.'],
  ['Place the vertices and branches.', 'Vertices are '+math('(−2,−3)')+' and '+math('(4,−3)')+', so the branches open left and right.']
 ],
 after:`${callout('Another related form','A circle uses '+math('(x-h)<sup>2</sup> + (y-k)<sup>2</sup> = r<sup>2</sup>')+'. An ellipse uses a sum of fractions, while this lesson’s hyperbola uses a difference of fractions.')}`,
 mini:{prompt:'In '+math(frac('(x−2)<sup>2</sup>','16')+' − '+frac('(y+3)<sup>2</sup>','9')+' = 1')+', what is the center?',options:['(2, −3)','(−2, 3)','(2, 3)'],correct:0,explain:'x−2 gives h=2 and y+3 means y−(−3), so k=−3.'}
},
{
 id:'lines',
 title:'Slope, line equations, and relationships',
 short:'Coordinate review',
 intro:'Several review problems ask you to read or write linear equations.',
 body:
  `${panel('m = '+frac('y<sub>2</sub> − y<sub>1</sub>','x<sub>2</sub> − x<sub>1</sub>')+'<br>y − y<sub>1</sub> = m(x − x<sub>1</sub>)','Use slope formula for two points, then point-slope form for a line through a known point.')}<div class="split-two"><div class="tile"><strong>Parallel lines</strong><p>same slope</p></div><div class="tile"><strong>Perpendicular lines</strong><p>slopes are negative reciprocals</p></div></div>`,
 steps:[
  ['Find the slope first.', 'For '+math('(0,1)')+' and '+math('(2,4)')+', slope is '+math(frac('4−1','2−0')+' = '+frac('3','2'))+'.'],
  ['Write an equation if needed.', 'Because the line goes through '+math('(0,1)')+', its y-intercept is 1.'],
  ['Compare slopes for relationships.', 'Slopes '+math('−'+frac('1','3'))+' and '+math('3')+' are negative reciprocals, so the lines are perpendicular.']
 ],
 after:`${callout('Point-slope reminder','A line with slope '+math(frac('1','6'))+' through '+math('(−4,−5)')+' is '+math('y + 5 = '+frac('1','6')+'(x + 4)')+'.')}`,
 mini:{prompt:'The line through '+math('(0,1)')+' and '+math('(2,4)')+' has which slope?',options:[frac('1','2'),frac('3','2'),frac('5','2')],correct:1,explain:'Rise is 3 and run is 2, so the slope is 3/2.'}
},
{
 id:'review',
 title:'Mixed review skills',
 short:'Equations, formulas, and applications',
 intro:'Problem Set 90 also reviews earlier skills such as complex numbers, quadratics, formula solving, and investment word problems.',
 body:
  `${panel('i<sup>2</sup> = −1<br>ax<sup>2</sup> + bx = 0 ⇒ x(ax+b)=0<br>To solve for a variable, undo operations step by step','Keep earlier algebra tools available while you practice this lesson’s main pattern.')}<p>When a problem asks for every solution, check whether there is more than one. When an application problem compares two quantities, define a variable and write an equation from the relationships in the prompt.</p>`,
 steps:[
  ['Complex numbers', math('2i(−9 + 8i) = −18i + 16i<sup>2</sup> = −16 − 18i')+'.'],
  ['Solve and factor', math('12x<sup>2</sup> + 48x = 12x(x+4) = 0')+', so use the zero-product property.'],
  ['Write an equation for the application.', 'For an investment problem, interest = rate × amount. Set the stated relationship equal and solve.']
 ],
 after:`${callout('Be explicit with units','For the bond and stock problems, the typed answer should be the dollar amount invested in the named account.')}`,
 mini:{prompt:'If '+math('p = 2s + b')+', what is p when '+math('s=11')+' and '+math('b=8')+'?',options:['19','22','30'],correct:2,explain:'p = 2(11)+8 = 30.'}
}
];

function buildQuestions(){
 const q=[];
 q.push(Q('p90-a','practice','a','Factoring a difference of squares','choice','Select the factored form of '+math('64c<sup>4</sup> − 25d<sup>2</sup>')+'.',{
  page:438,choices:makeChoices(['(32c<sup>2</sup> + 12.5d)(32c<sup>2</sup> − 12.5d)','(8c<sup>2</sup> − 5d)(8c<sup>2</sup> − 5d)','(8c<sup>2</sup> + 5d)(8c<sup>2</sup> − 5d)','(8c<sup>2</sup> + 5d)(8c<sup>2</sup> + 5d)','(8c<sup>4</sup> + 5d<sup>2</sup>)(8c<sup>4</sup> − 5d<sup>2</sup>)']),correct:2,
  answerHTML:'(8c<sup>2</sup> + 5d)(8c<sup>2</sup> − 5d)',answerText:'(8c^2 + 5d)(8c^2 - 5d)',lesson:'factor',guide:['Recognize each term as a square.','Take the square roots of the terms.','Use one plus factor and one minus factor.'],hints:['64c⁴ = (8c²)².','25d² = (5d)².','A difference of squares factors as (A+B)(A−B).'],solution:['Rewrite the expression as '+math('(8c<sup>2</sup>)<sup>2</sup> − (5d)<sup>2</sup>')+'.','Apply the pattern '+math('A<sup>2</sup> − B<sup>2</sup> = (A+B)(A−B)')+'.'],check:'Distributing the factors returns 64c⁴ − 25d².'
 }));
 q.push(Q('p90-b','practice','b','Factoring a trinomial review','choice','Select the factored form of '+math('x<sup>2</sup> − 8bx + 12b<sup>2</sup>')+'.',{
  page:438,choices:makeChoices(['(x − 12b)(x − b)','(x + 3b)(x + 4b)','(x + 6b)(x + 2b)','(x − 3b)(x − 4b)','(x − 6b)(x − 2b)']),correct:4,
  answerHTML:'(x − 6b)(x − 2b)',answerText:'(x - 6b)(x - 2b)',lesson:'review',guide:['Look for two terms that multiply to 12b².','Those same terms must add to −8b.','Write two binomials using x and the two terms.'],hints:['The two numbers are both negative because the middle term is negative but the last term is positive.','6b and 2b multiply to 12b² and add to 8b; using both negatives gives −8b.'],solution:['Find two terms whose product is '+math('12b<sup>2</sup>')+' and whose sum is '+math('−8b')+'.','Those terms are '+math('−6b')+' and '+math('−2b')+'.','So the factorization is '+math('(x−6b)(x−2b)')+'.'],check:'Expanding gives x² − 8bx + 12b².'
 }));
 q.push(Q('p90-c','practice','c','Solving a formula for u','choice','Which choice below represents the equation '+math('s = '+frac('5.6t<sup>2</sup>','2u<sup>2</sup>'))+' after it has been solved for '+math('u')+'?',{
  page:438,choices:makeChoices(['u = ±'+root(frac('5.6t<sup>2</sup>','2s')),'u = '+frac('5.6t<sup>2</sup>','4s'),'u = ±'+root(frac('11.2t<sup>2</sup>','s')),'u = ±'+root(frac('5.6t<sup>2</sup>','s'))+' − 2','u = ±'+root(frac('s','11.2t<sup>2</sup>'))]),correct:0,
  answerHTML:'u = ±'+root(frac('5.6t<sup>2</sup>','2s')),answerText:'u = ±sqrt(5.6t^2 / (2s))',lesson:'review',guide:['Clear the denominator by multiplying both sides by 2u².','Isolate u².','Take square roots and include ±.'],hints:['2su² = 5.6t² after clearing the denominator.','Now divide both sides by 2s.','Taking a square root introduces ±.'],solution:[math('s = '+frac('5.6t<sup>2</sup>','2u<sup>2</sup>'))+'.', 'Multiply both sides by '+math('2u<sup>2</sup>')+' to get '+math('2su<sup>2</sup> = 5.6t<sup>2</sup>')+'.', 'Divide by '+math('2s')+': '+math('u<sup>2</sup> = '+frac('5.6t<sup>2</sup>','2s'))+'.', 'Take square roots: '+math('u = ±'+root(frac('5.6t<sup>2</sup>','2s')))+'.'],check:'Substituting this expression for u back into the formula reproduces the original relationship.'
 }));
 q.push(Q('p90-d','practice','d','Selecting the graph of a hyperbola','choice','Select the graph of the equation '+math(frac('(x−2)<sup>2</sup>','16')+' − '+frac('(y+3)<sup>2</sup>','9')+' = 1')+'.',{
  page:439,asset:'practice-d',choices:makeChoices(['Graph A','Graph B','Graph C','Graph D','Graph E']),correct:1,
  answerHTML:'Graph B',answerText:'Graph B',lesson:'hyperbola',guide:['Find the center from the equation.','Because the x-part is first and positive, the hyperbola opens left and right.','Use a² = 16 and b² = 9 to locate the rectangle and vertices.'],hints:['The center is (2, −3).','a = 4 and b = 3.','Vertices should be (−2, −3) and (6, −3).'],solution:['The equation is in the form '+math(frac('(x − h)<sup>2</sup>','a<sup>2</sup>')+' − '+frac('(y − k)<sup>2</sup>','b<sup>2</sup>')+' = 1')+'.','So the center is '+math('(2,−3)')+', '+math('a=4')+', and '+math('b=3')+'.','The correct graph opens left and right with vertices '+math('(−2,−3)')+' and '+math('(6,−3)')+'. That is <strong>Graph B</strong>.'],check:'Graph B also shows the guiding rectangle with top and bottom at y = 0 and y = −6.',answerHelp:'Study the figure above, then choose the matching graph letter.'
 }));
 q.push(Q('p90-e','practice','e','Bond investment word problem','numeric','Fred invested $25,000 in two different types of bonds. The first type earned 6% interest (profit), and the second type earned 9% interest. If the interest on the 9% bond was $750 more than the interest on the 6% bond, how much did Fred invest in the 6% bond?',{
  page:439,fields:[{key:'amount',label:'Amount invested in the 6% bond',prefix:'$',placeholder:'dollars',value:10000,tolerance:0.01}],answerHTML:'$10,000',answerText:'10000',lesson:'review',guide:['Let x be the amount in the 6% bond.','Then 25,000 − x is the amount in the 9% bond.','Use the profit relationship to write an equation.'],hints:['Interest = rate × amount.','Write '+math('0.09(25000 − x) = 0.06x + 750')+'.','Solve for x.'],solution:['Let '+math('x')+' be the amount invested at 6%. Then '+math('25000−x')+' is invested at 9%.','Use the statement “the 9% interest was $750 more”: '+math('0.09(25000−x) = 0.06x + 750')+'.','Solve: '+math('2250 − 0.09x = 0.06x + 750')+', so '+math('1500 = 0.15x')+'.','Therefore '+math('x = 10000')+'.'],check:'6% of 10,000 is $600. 9% of 15,000 is $1,350. The difference is $750.'
 }));
 
 q.push(Q('ps90-1','problem','1','Powers of i','choice','Calculate the value of '+math('(−4i)<sup>3</sup>')+' and select the fully simplified answer.',{
  page:439,choices:makeChoices(['12i','−12i','−64i','64i','64']),correct:3,answerHTML:'64i',answerText:'64i',lesson:'review',guide:['Cube the coefficient −4.','Cube i separately.','Remember that i³ = i²·i = −i.'],hints:['(−4)³ = −64.','i³ = −i.'],solution:[math('(−4i)<sup>3</sup> = (−4)<sup>3</sup>i<sup>3</sup> = −64(−i) = 64i')+'.'],check:'The final answer still contains i because the exponent on i is odd.'
 }));
 q.push(Q('ps90-2','problem','2','Multiplying complex numbers','choice','Calculate the value of '+math('2i(−9 + 8i)')+' and select the fully simplified answer.',{
  page:439,choices:makeChoices(['−16 − 18i','2','−10 − 7i','−2i','16 − 18i']),correct:0,answerHTML:'−16 − 18i',answerText:'-16 - 18i',lesson:'review',guide:['Distribute 2i to both terms.','Use i² = −1.','Combine the real and imaginary parts.'],hints:['2i(−9) = −18i.','2i(8i) = 16i² = −16.'],solution:['Distribute: '+math('2i(−9+8i) = −18i + 16i<sup>2</sup>')+'.','Because '+math('i<sup>2</sup>=−1')+', the expression becomes '+math('−18i−16')+'.','Write in standard form: '+math('−16−18i')+'.'],check:'The real part is −16 and the imaginary part is −18i.'
 }));
 q.push(Q('ps90-3','problem','3','Parallel or perpendicular?','choice','Tell whether the lines '+math('y = −'+frac('1','3')+'x')+' and '+math('y = 3x + 5')+' are parallel or perpendicular.',{
  page:439,choices:makeChoices(['Parallel','Perpendicular','Neither']),correct:1,answerHTML:'Perpendicular',answerText:'Perpendicular',lesson:'lines',guide:['Read the slopes from each equation.','Compare them.','Use the negative-reciprocal test.'],hints:['The slopes are −1/3 and 3.','Their product is −1.'],solution:['The first line has slope '+math('−'+frac('1','3'))+'. The second has slope '+math('3')+'.','Because these slopes are negative reciprocals, the lines are <strong>perpendicular</strong>.'],check:'Parallel lines would need exactly the same slope.'
 }));
 q.push(Q('ps90-4','problem','4','Center and vertices of an ellipse','numeric','Tell the center and vertices of the ellipse '+math(frac('x<sup>2</sup>','64')+' + '+frac('y<sup>2</sup>','16')+' = 1')+'. Enter the center and the two vertices on the major axis.',{
  page:439,fields:[
   {key:'centerx',label:'Center x',placeholder:'number',value:0,tolerance:1e-9},
   {key:'centery',label:'Center y',placeholder:'number',value:0,tolerance:1e-9},
   {key:'leftx',label:'Left vertex x',placeholder:'number',value:-8,tolerance:1e-9},
   {key:'lefty',label:'Left vertex y',placeholder:'number',value:0,tolerance:1e-9},
   {key:'rightx',label:'Right vertex x',placeholder:'number',value:8,tolerance:1e-9},
   {key:'righty',label:'Right vertex y',placeholder:'number',value:0,tolerance:1e-9}
  ],answerHTML:'Center: (0, 0); vertices: (−8, 0) and (8, 0)',answerText:'center (0,0), vertices (-8,0) and (8,0)',lesson:'review',guide:['Compare the equation to the standard ellipse form.','The larger denominator is under x², so the major axis is horizontal.','Take square roots of the denominators to get the semi-axis lengths.'],hints:['The center is the origin because there are no shifts.','a² = 64, so a = 8.','Vertices on the major axis are (±8, 0).'],solution:['The equation is '+math(frac('x<sup>2</sup>','64')+' + '+frac('y<sup>2</sup>','16')+' = 1')+'.','The center is '+math('(0,0)')+'. The larger denominator is 64, so the major axis is horizontal with '+math('a = 8')+'.','Therefore the vertices are '+math('(−8,0)')+' and '+math('(8,0)')+'.'],check:'Each vertex is 8 units from the center along the x-axis.',answerHelp:'Enter the center, then the left vertex, then the right vertex.'
 }));
 q.push(Q('ps90-5','problem','5','Difference of squares factorization','choice','Select the factored form of '+math('x<sup>2</sup> − y<sup>2</sup>')+'.',{
  page:440,choices:makeChoices(['(x<sup>2</sup> + y<sup>2</sup>)<sup>2</sup>','(x + y)(x − y)','(x + y)(x + y)','2(x − y)','(x − y)(x − y)']),correct:1,answerHTML:'(x + y)(x − y)',answerText:'(x+y)(x-y)',lesson:'factor',guide:['Recognize a² − b².','Use one plus and one minus factor.'],hints:['The factors must have opposite signs.'],solution:['This is the standard pattern '+math('a<sup>2</sup>−b<sup>2</sup> = (a+b)(a−b)')+' with '+math('a=x')+' and '+math('b=y')+'.'],check:'Expanding gives x² − y².'
 }));
 q.push(Q('ps90-6','problem','6','Perfect-square trinomial','choice','Select the factored form of '+math('x<sup>2</sup> − 2xy + y<sup>2</sup>')+'.',{
  page:440,choices:makeChoices(['(x + y)<sup>2</sup>','(x − 1)(y − 1)','(x + y)(x − y)','(x − y)<sup>2</sup>','(x + 1)(x − y)']),correct:3,answerHTML:'(x − y)<sup>2</sup>',answerText:'(x-y)^2',lesson:'review',guide:['Check the first and last terms.','See whether the middle term is twice the product.'],hints:['The first and last terms are squares.','The middle term is −2xy.'],solution:['The expression matches '+math('a<sup>2</sup> − 2ab + b<sup>2</sup> = (a−b)<sup>2</sup>')+' with '+math('a=x')+' and '+math('b=y')+'.'],check:'Expanding (x−y)² gives x²−2xy+y².'
 }));
 q.push(Q('ps90-7','problem','7','Complicated difference of squares','choice','Select the factored form of '+math('81a<sup>4</sup> − 49b<sup>2</sup>')+'.',{
  page:440,choices:makeChoices(['(9a<sup>2</sup> + 7b)(9a<sup>2</sup> + 7b)','(9a<sup>2</sup> − 7b)(9a<sup>2</sup> − 7b)','(9a<sup>4</sup> + 7b<sup>2</sup>)(9a<sup>4</sup> − 7b<sup>2</sup>)','(9a<sup>2</sup> + 7b)(9a<sup>2</sup> − 7b)','(40.5a<sup>2</sup> + 24.5b)(40.5a<sup>2</sup> − 24.5b)']),correct:3,answerHTML:'(9a<sup>2</sup> + 7b)(9a<sup>2</sup> − 7b)',answerText:'(9a^2+7b)(9a^2-7b)',lesson:'complicated',guide:['Rewrite each term as a square.','Use the difference-of-squares pattern.'],hints:['81a⁴ = (9a²)².','49b² = (7b)².'],solution:['Recognize '+math('81a<sup>4</sup> = (9a<sup>2</sup>)<sup>2}')+' and '+math('49b<sup>2</sup> = (7b)<sup>2}')+'.','Then factor as '+math('(9a<sup>2</sup> + 7b)(9a<sup>2</sup> − 7b)')+'.'],check:'The middle terms cancel when the product is expanded.'
 }));
 q.push(Q('ps90-8','problem','8','Factoring out a common factor','choice','Select the factored form of '+math('3pq − 6p<sup>2</sup>q<sup>2</sup>')+'.',{
  page:440,choices:makeChoices(['3p<sup>2</sup>q<sup>2</sup>(pq − 2)','3pq(1 − 9pq)','3pq(1 − 2pq)','6pq(2 − pq)','−3pq(1 − 3pq)']),correct:2,answerHTML:'3pq(1 − 2pq)',answerText:'3pq(1-2pq)',lesson:'review',guide:['Find the greatest common factor of both terms.','Factor it out.','Check by distributing.'],hints:['Both terms share 3pq.'],solution:['Factor out '+math('3pq')+': '+math('3pq − 6p<sup>2</sup>q<sup>2</sup> = 3pq(1 − 2pq)')+'.'],check:'Distributing 3pq returns the original expression.'
 }));
 q.push(Q('ps90-9','problem','9','Factoring a trinomial','choice','Select the factored form of '+math('x<sup>2</sup> − 7bx + 10b<sup>2</sup>')+'.',{
  page:440,choices:makeChoices(['(x − 10b)(x − b)','(x + 5b)(x + 2b)','(x − 5b)(x − 2b)','(x − 7b)(x + 10b)','(x + 10b)(x + b)']),correct:2,answerHTML:'(x − 5b)(x − 2b)',answerText:'(x-5b)(x-2b)',lesson:'review',guide:['Find two terms that multiply to 10b² and add to −7b.'],hints:['The terms are both negative.'],solution:['The factor pair is '+math('−5b')+' and '+math('−2b')+' because they multiply to '+math('10b<sup>2</sup>')+' and add to '+math('−7b')+'.'],check:'Expanding gives x² − 7bx + 10b².'
 }));
 q.push(Q('ps90-10','problem','10','Simplifying by distribution','choice','Select the simplified form of '+math(frac('1','5')+'x<sup>2</sup>y(20x + 15y)')+'.',{
  page:440,choices:makeChoices(['4x<sup>3</sup>y + 3x<sup>2</sup>y<sup>2</sup>','20'+frac('1','5')+'x<sup>3</sup>y + 15'+frac('1','5')+'x<sup>2</sup>y<sup>2</sup>','4x<sup>3</sup>y + 15y','4x<sup>2</sup>y + 3x<sup>2</sup>y','60x<sup>3</sup>y<sup>2</sup>']),correct:0,answerHTML:'4x<sup>3</sup>y + 3x<sup>2</sup>y<sup>2</sup>',answerText:'4x^3y + 3x^2y^2',lesson:'review',guide:['Distribute the monomial to each term in the parentheses.','Multiply coefficients and add exponents on like bases.'],hints:['One fifth of 20 is 4.','One fifth of 15 is 3.'],solution:[''+math(frac('1','5')+'x<sup>2</sup>y(20x) = 4x<sup>3</sup>y')+'.',''+math(frac('1','5')+'x<sup>2</sup>y(15y) = 3x<sup>2</sup>y<sup>2</sup>')+'.','So the simplified form is '+math('4x<sup>3</sup>y + 3x<sup>2</sup>y<sup>2</sup>')+'.'],check:'Each term of the binomial has been multiplied by the outside monomial.'
 }));
 q.push(Q('ps90-11','problem','11','Difference of squares simplification','choice','Select the simplified form of '+math('(x + y)(x − y)')+'.',{
  page:440,choices:makeChoices(['(x + y)<sup>2</sup>','(x − y)<sup>2</sup>','x<sup>2</sup> + y<sup>2</sup>','2x − 2y','x<sup>2</sup> − y<sup>2</sup>']),correct:4,answerHTML:'x<sup>2</sup> − y<sup>2</sup>',answerText:'x^2-y^2',lesson:'difference',guide:['Use the opposite-sign product pattern.'],hints:['The middle terms cancel.'],solution:['By the difference-of-squares pattern, '+math('(x+y)(x−y) = x<sup>2</sup>−y<sup>2</sup>')+'.'],check:'Direct distribution gives x² − xy + xy − y².'
 }));
 q.push(Q('ps90-12','problem','12','Simplifying a product','choice','Select the simplified form of '+math('(r + s)(r<sup>2</sup> + 2rs + s<sup>2</sup>)')+'.',{
  page:440,choices:makeChoices(['r<sup>3</sup> + 3r<sup>2</sup>s<sup>2</sup> + s<sup>3</sup>','r<sup>3</sup> + 2rs + s<sup>3</sup>','r<sup>2</sup> + r + 2rs + s + s<sup>3</sup>','r<sup>3</sup> + 3r<sup>2</sup>s + 3rs<sup>2</sup> + s<sup>3</sup>','r<sup>3</sup> + 2r<sup>2</sup>s + 2rs<sup>2</sup> + s<sup>3</sup>']),correct:3,answerHTML:'r<sup>3</sup> + 3r<sup>2</sup>s + 3rs<sup>2</sup> + s<sup>3</sup>',answerText:'r^3 + 3r^2s + 3rs^2 + s^3',lesson:'review',guide:['Recognize the second factor as (r+s)².','Then multiply by (r+s) to get (r+s)³.'],hints:['r² + 2rs + s² = (r+s)².'],solution:['Since '+math('r<sup>2</sup> + 2rs + s<sup>2</sup> = (r+s)<sup>2</sup>')+', the whole expression is '+math('(r+s)<sup>3</sup>')+'.','Expand: '+math('(r+s)<sup>3</sup> = r<sup>3</sup> + 3r<sup>2</sup>s + 3rs<sup>2</sup> + s<sup>3</sup>')+'.'],check:'This matches the binomial-cube pattern.'
 }));
 q.push(Q('ps90-13','problem','13','Combining like terms','choice','Select the simplified form of '+math('3.2xyz + 3y + 1.8xyz + 2y')+'.',{
  page:440,choices:makeChoices(['5xyz + 5y','10x<sup>2</sup>y<sup>4</sup>z<sup>2</sup>','1.4xyz + 5y','5xyz + 6y','5.76xyz + 6y']),correct:0,answerHTML:'5xyz + 5y',answerText:'5xyz+5y',lesson:'review',guide:['Combine like terms with xyz.','Combine like terms with y.'],hints:['3.2xyz + 1.8xyz = 5xyz.','3y + 2y = 5y.'],solution:['Add the like terms: '+math('3.2xyz + 1.8xyz = 5xyz')+' and '+math('3y + 2y = 5y')+'.','So the expression simplifies to '+math('5xyz + 5y')+'.'],check:'Only identical variable parts can be combined.'
 }));
 q.push(Q('ps90-14','problem','14','Solving a linear equation','numeric','Solve the equation '+math('0 = '+frac('−8(3x+5)','2'))+'.',{
  page:440,fields:[{key:'x',label:'x',placeholder:'fraction or decimal',value:-5/3,tolerance:1e-9}],answerHTML:'x = −'+frac('5','3'),answerText:'x = -5/3',lesson:'review',guide:['Simplify the right side.','Set the remaining factor equal to zero.'],hints:['−8 ÷ 2 = −4.','If −4(3x+5)=0, then 3x+5=0.'],solution:['Simplify the right side: '+math('0 = −4(3x+5)')+'.','Divide by −4: '+math('0 = 3x+5')+'.','Then '+math('3x = −5')+' and '+math('x = −'+frac('5','3'))+'.'],check:'Substitute −5/3 into 3x+5 to get 0.'
 }));
 q.push(Q('ps90-15','problem','15','Solving a quadratic equation','numeric','Solve the equation '+math('12x<sup>2</sup> + 48x = 0')+'. Give both solutions from least to greatest.',{
  page:440,fields:[{key:'small',label:'Smaller solution',placeholder:'number',value:-4,tolerance:1e-9},{key:'large',label:'Larger solution',placeholder:'number',value:0,tolerance:1e-9}],answerHTML:'x = −4 or x = 0',answerText:'-4, 0',lesson:'review',guide:['Factor out the greatest common factor.','Use the zero-product property.'],hints:['Factor out 12x.'],solution:[''+math('12x<sup>2</sup> + 48x = 12x(x+4)')+'.','Set each factor equal to zero: '+math('12x=0')+' or '+math('x+4=0')+'.','So the solutions are '+math('x=0')+' and '+math('x=−4')+'.'],check:'Both values make the original equation equal zero.',answerHelp:'Enter the smaller solution first, then the larger solution.'
 }));
 q.push(Q('ps90-16','problem','16','Substituting into a formula','numeric','In the equation '+math('p = 2s + b')+', find the value of '+math('p')+' when '+math('s = 11')+' and '+math('b = 8')+'.',{
  page:440,fields:[{key:'p',label:'Value of p',placeholder:'number',value:30,tolerance:1e-9}],answerHTML:'p = 30',answerText:'30',lesson:'review',guide:['Substitute the given values.','Then simplify.'],hints:['2 × 11 = 22.'],solution:['Substitute: '+math('p = 2(11) + 8')+'.','So '+math('p = 22 + 8 = 30')+'.'],check:'The evaluated value is 30.'
 }));
 q.push(Q('ps90-17','problem','17','Solving a formula for v','choice','Which choice below represents the equation '+math('y = '+frac('9.8x<sup>2</sup>','2v<sup>2</sup>'))+' after it has been solved for '+math('v')+'?',{
  page:440,choices:makeChoices(['v = '+frac('9.8x<sup>2</sup>','4y'),'v = ±'+root(frac('9.8x<sup>2</sup>','y'))+' − 2','v = ±'+root(frac('19.6x<sup>2</sup>','y')),'v = ±'+root(frac('y','19.6x<sup>2</sup>')),'v = ±'+root(frac('9.8x<sup>2</sup>','2y'))]),correct:4,
  answerHTML:'v = ±'+root(frac('9.8x<sup>2</sup>','2y')),answerText:'v = ±sqrt(9.8x^2/(2y))',lesson:'review',guide:['Clear the denominator.','Isolate v².','Take square roots and include ±.'],hints:['2yv² = 9.8x².','Then v² = 9.8x² / 2y.'],solution:[math('y = '+frac('9.8x<sup>2</sup>','2v<sup>2</sup>'))+'.','Multiply both sides by '+math('2v<sup>2</sup>')+': '+math('2yv<sup>2</sup> = 9.8x<sup>2</sup>')+'.','Divide by '+math('2y')+': '+math('v<sup>2</sup> = '+frac('9.8x<sup>2</sup>','2y'))+'.','Take square roots: '+math('v = ±'+root(frac('9.8x<sup>2</sup>','2y')))+'.'],check:'The correct choice keeps the denominator 2y inside the radical.'
 }));
 q.push(Q('ps90-18','problem','18','Matching a linear graph','choice','Select the graph of the two-variable equation '+math('y = −3x')+'.',{
  page:441,asset:'ps18',choices:makeChoices(['Graph A','Graph B','Graph C','Graph D','Graph E']),correct:2,
  answerHTML:'Graph C',answerText:'Graph C',lesson:'lines',guide:['The line y = −3x passes through the origin.','Its slope is negative and steep: down 3 for every right 1.'],hints:['Look for a graph passing through (0,0).','Another point on the line is (1,−3).'],solution:['The equation '+math('y=−3x')+' has y-intercept 0 and slope −3.','So the correct graph passes through '+math('(0,0)')+' and '+math('(1,−3)')+'. That is <strong>Graph C</strong>.'],check:'Only Graph C shows both the origin and the point (1, −3).',answerHelp:'Use the graph image above, then choose A–E.'
 }));
 q.push(Q('ps90-19','problem','19','Matching a hyperbola graph','choice','Select the graph of the equation '+math(frac('(x−1)<sup>2</sup>','9')+' − '+frac('(y+3)<sup>2</sup>','4')+' = 1')+'.',{
  page:441,asset:'ps19',choices:makeChoices(['Graph A','Graph B','Graph C','Graph D','Graph E']),correct:4,
  answerHTML:'Graph E',answerText:'Graph E',lesson:'hyperbola',guide:['Find the center.','The hyperbola opens left and right.','Use a = 3 and b = 2.'],hints:['The center is (1, −3).','Vertices are (−2, −3) and (4, −3).','The top and bottom of the guide rectangle are y = −1 and y = −5.'],solution:['This hyperbola has center '+math('(1,−3)')+', '+math('a=3')+', and '+math('b=2')+'.','So it opens left and right with vertices '+math('(−2,−3)')+' and '+math('(4,−3)')+'.','That matches <strong>Graph E</strong>.'],check:'Graph E shows a left-right opening hyperbola centered at (1, −3), with vertices (−2, −3) and (4, −3) and guide points (1, −1) and (1, −5).',answerHelp:'Use the graph image above, then choose A–E.'
 }));
 q.push(Q('ps90-20','problem','20','Point-slope form','choice','Select the equation for the line crossing the point '+math('(−4, −5)')+' and with slope '+math(frac('1','6'))+'.',{
  page:442,choices:makeChoices(['y + 4 = '+frac('1','6')+'(x + 5)','y + 5 = 6(x + 4)','y − 5 = '+frac('1','6')+'(x − 4)','y − 4 = '+frac('1','3')+'(x − 5)','y + 5 = '+frac('1','6')+'(x + 4)']),correct:4,
  answerHTML:'y + 5 = '+frac('1','6')+'(x + 4)',answerText:'y+5=(1/6)(x+4)',lesson:'lines',guide:['Use point-slope form.','Substitute the slope and point.'],hints:['Point-slope form is y − y₁ = m(x − x₁).','Because the point is (−4, −5), subtracting the coordinates changes the signs.'],solution:['Use '+math('y−y<sub>1</sub> = m(x−x<sub>1</sub>)')+' with '+math('m='+frac('1','6'))+' and '+math('(x<sub>1</sub>,y<sub>1</sub>)=(−4,−5)')+'.','Then '+math('y−(−5) = '+frac('1','6')+'(x−(−4))')+', which simplifies to '+math('y+5 = '+frac('1','6')+'(x+4)')+'.'],check:'Substituting x = −4 gives y = −5.',answerHelp:'Select the equation written in point-slope form.'
 }));
 q.push(Q('ps90-21','problem','21','Equation of a line through two points','choice','Select the equation for the line crossing the points '+math('(0,1)')+' and '+math('(2,4)')+'.',{
  page:442,choices:makeChoices(['y = '+frac('3','2')+'x + 1','y = '+frac('5','2')+'x + 1','y = '+frac('3','2')+'x − 1','y = '+frac('1','2')+'x + 1','y = '+frac('5','2')+'(x−1)']),correct:0,
  answerHTML:'y = '+frac('3','2')+'x + 1',answerText:'y=(3/2)x+1',lesson:'lines',guide:['Compute the slope using the two points.','Use the point with x = 0 to identify the y-intercept.'],hints:['The slope is (4−1)/(2−0) = 3/2.','Because the line passes through (0,1), the intercept is 1.'],solution:['Slope: '+math('m = '+frac('4−1','2−0')+' = '+frac('3','2'))+'.','Using '+math('(0,1)')+', the y-intercept is 1, so the equation is '+math('y = '+frac('3','2')+'x + 1')+'.'],check:'Substitute x = 2 to get y = 4.',answerHelp:'Find the slope first, then choose the equation with the correct intercept.'
 }));
 q.push(Q('ps90-22','problem','22','Stock investment word problem','numeric','Howard invested $50,000 in two different types of stocks. The first type earned 8% profit and the second type earned 10% profit. If the profit on the 10% stock was $1,400 more than the profit on the 8% stock, how much did Howard invest in the 8% stock?',{
  page:442,fields:[{key:'amount',label:'Amount invested in the 8% stock',prefix:'$',placeholder:'dollars',value:20000,tolerance:0.01}],answerHTML:'$20,000',answerText:'20000',lesson:'review',guide:['Let x be the amount in the 8% stock.','Then 50,000 − x is the amount in the 10% stock.','Write the equation from the profit comparison.'],hints:['Interest/profit = rate × amount.','Use '+math('0.10(50000−x) = 0.08x + 1400')+'.'],solution:['Let '+math('x')+' be the amount invested at 8%. Then '+math('50000−x')+' is at 10%.','Write the equation: '+math('0.10(50000−x) = 0.08x + 1400')+'.','Solve: '+math('5000 − 0.10x = 0.08x + 1400')+', so '+math('3600 = 0.18x')+'.','Therefore '+math('x = 20000')+'.'],check:'8% of 20,000 is $1,600 and 10% of 30,000 is $3,000. The difference is $1,400.'
 }));
 return q;
}

function graphCard(label,kind,cfg){
 const W=230,H=190,s=14,ox=115,oy=95;const X=x=>ox+x*s,Y=y=>oy-y*s;
 let body='';
 if(kind==='line'){
  const m=cfg.m,b=cfg.b||0,x1=-6,x2=6,y1=m*x1+b,y2=m*x2+b;
  body+=`<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="#263b40" stroke-width="4"/>`;
  for(const p of cfg.points||[]) body+=`<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4.5" fill="#17685f"/><text x="${X(p[0])+5}" y="${Y(p[1])-7}" font-size="10">(${p[0]},${p[1]})</text>`;
 }else{
  const {h,k,a,b,orientation}=cfg;
  const xL=h-a,xR=h+a,yT=k+b,yB=k-b;
  body+=`<rect x="${X(xL)}" y="${Y(yT)}" width="${2*a*s}" height="${2*b*s}" fill="none" stroke="#7a8581" stroke-width="1.5" stroke-dasharray="5 4"/>`;
  body+=`<line x1="${X(h-a*2.1)}" y1="${Y(k-b*2.1)}" x2="${X(h+a*2.1)}" y2="${Y(k+b*2.1)}" stroke="#7a8581" stroke-width="1.4" stroke-dasharray="5 4"/><line x1="${X(h-a*2.1)}" y1="${Y(k+b*2.1)}" x2="${X(h+a*2.1)}" y2="${Y(k-b*2.1)}" stroke="#7a8581" stroke-width="1.4" stroke-dasharray="5 4"/>`;
  if(orientation==='h'){
   const left=`M ${X(h-a)} ${Y(k)} C ${X(h-a*1.25)} ${Y(k-b*.4)} ${X(h-a*1.7)} ${Y(k-b*1.1)} ${X(h-a*2.2)} ${Y(k-b*1.7)} M ${X(h-a)} ${Y(k)} C ${X(h-a*1.25)} ${Y(k+b*.4)} ${X(h-a*1.7)} ${Y(k+b*1.1)} ${X(h-a*2.2)} ${Y(k+b*1.7)}`;
   const right=`M ${X(h+a)} ${Y(k)} C ${X(h+a*1.25)} ${Y(k-b*.4)} ${X(h+a*1.7)} ${Y(k-b*1.1)} ${X(h+a*2.2)} ${Y(k-b*1.7)} M ${X(h+a)} ${Y(k)} C ${X(h+a*1.25)} ${Y(k+b*.4)} ${X(h+a*1.7)} ${Y(k+b*1.1)} ${X(h+a*2.2)} ${Y(k+b*1.7)}`;
   body+=`<path d="${left} ${right}" fill="none" stroke="#263b40" stroke-width="4"/>`;
  }else{
   const up=`M ${X(h)} ${Y(k+b)} C ${X(h-a*.4)} ${Y(k+b*1.25)} ${X(h-a*1.1)} ${Y(k+b*1.7)} ${X(h-a*1.7)} ${Y(k+b*2.2)} M ${X(h)} ${Y(k+b)} C ${X(h+a*.4)} ${Y(k+b*1.25)} ${X(h+a*1.1)} ${Y(k+b*1.7)} ${X(h+a*1.7)} ${Y(k+b*2.2)}`;
   const down=`M ${X(h)} ${Y(k-b)} C ${X(h-a*.4)} ${Y(k-b*1.25)} ${X(h-a*1.1)} ${Y(k-b*1.7)} ${X(h-a*1.7)} ${Y(k-b*2.2)} M ${X(h)} ${Y(k-b)} C ${X(h+a*.4)} ${Y(k-b*1.25)} ${X(h+a*1.1)} ${Y(k-b*1.7)} ${X(h+a*1.7)} ${Y(k-b*2.2)}`;
   body+=`<path d="${up} ${down}" fill="none" stroke="#263b40" stroke-width="4"/>`;
  }
  for(const p of cfg.points||[]) body+=`<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4" fill="#17685f"/><text x="${X(p[0])+5}" y="${Y(p[1])-5}" font-size="9">(${p[0]},${p[1]})</text>`;
 }
 return `<div style="border:1px solid var(--line);border-radius:12px;padding:8px;background:var(--surface)"><div style="font-weight:800;margin:0 0 4px 4px">${label}</div><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Graph ${label}"><line x1="12" y1="${oy}" x2="218" y2="${oy}" stroke="#66736f"/><line x1="${ox}" y1="8" x2="${ox}" y2="182" stroke="#66736f"/>${body}</svg></div>`;
}
function graphSet(kind){
 let cards=[];
 if(kind==='practice-d') cards=[
  ['A','hyper',{h:-2,k:3,a:4,b:3,orientation:'h',points:[[-6,3],[2,3],[-2,6],[-2,0]]}],
  ['B','hyper',{h:2,k:-3,a:4,b:3,orientation:'h',points:[[-2,-3],[6,-3],[2,0],[2,-6]]}],
  ['C','hyper',{h:3,k:2,a:4,b:3,orientation:'h',points:[[-1,2],[7,2],[3,5],[3,-1]]}],
  ['D','hyper',{h:2,k:-3,a:4,b:3,orientation:'v',points:[[2,0],[2,-6],[-2,-3],[6,-3]]}],
  ['E','hyper',{h:2,k:-3,a:3,b:4,orientation:'v',points:[[2,1],[2,-7],[-1,-3],[5,-3]]}]
 ];
 if(kind==='ps18') cards=[
  ['A','line',{m:-2,b:0,points:[[0,0],[1,-2]]}],
  ['B','line',{m:-1,b:3,points:[[0,3],[3,0]]}],
  ['C','line',{m:-3,b:0,points:[[0,0],[1,-3]]}],
  ['D','line',{m:3,b:0,points:[[0,0],[1,3]]}],
  ['E','line',{m:1,b:3,points:[[-3,0],[0,3]]}]
 ];
 if(kind==='ps19') cards=[
  ['A','hyper',{h:1,k:-3,a:2,b:3,orientation:'v',points:[[1,0],[1,-6],[-1,-3],[3,-3]]}],
  ['B','hyper',{h:-1,k:3,a:3,b:2,orientation:'h',points:[[-4,3],[2,3],[-1,5],[-1,1]]}],
  ['C','hyper',{h:1,k:-3,a:3,b:2,orientation:'v',points:[[1,-1],[1,-5],[-2,-3],[4,-3]]}],
  ['D','hyper',{h:1,k:-3,a:2,b:3,orientation:'v',points:[[1,0],[1,-6],[-1,-3],[3,-3]]}],
  ['E','hyper',{h:1,k:-3,a:3,b:2,orientation:'h',points:[[-2,-3],[4,-3],[1,-1],[1,-5]]}]
 ];
 return `<figure class="graph-frame" style="max-width:none"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;padding:10px">${cards.map(x=>graphCard(...x)).join('')}</div><figcaption>Native app redraw from the supplied Lesson 90 source coordinates and graph structure; the source photograph itself is not embedded.</figcaption></figure>`;
}
function renderQuestionAsset(q){return q.asset?graphSet(q.asset):'';}

function referenceHtml(){
 return `<p>Use this sheet while you work. It summarizes the lesson patterns and related review tools.</p><div class="reference-grid">
 <div class="reference-item"><h4>Difference of squares</h4>${math('a<sup>2</sup> − b<sup>2</sup> = (a+b)(a−b)')}<p>One plus-factor and one minus-factor.</p></div>
 <div class="reference-item"><h4>Opposite-sign product</h4>${math('(x+a)(x−a)=x<sup>2</sup>−a<sup>2</sup>')}<p>The middle terms cancel.</p></div>
 <div class="reference-item"><h4>Complicated cases</h4><p>Rewrite each term as a square first, such as ${math('16x<sup>4</sup>=(4x<sup>2</sup>)<sup>2</sup>')} and ${math('25y<sup>6</sup>=(5y<sup>3</sup>)<sup>2</sup>')}.</p></div>
 <div class="reference-item"><h4>Hyperbola</h4>${math(frac('(x−h)<sup>2</sup>','a<sup>2</sup>')+' − '+frac('(y−k)<sup>2</sup>','b<sup>2</sup>')+' = 1')}<p>Center (h, k); vertices (h±a, k); opens left/right.</p></div>
 <div class="reference-item"><h4>Slope</h4>${math('m = '+frac('y<sub>2</sub> − y<sub>1</sub>','x<sub>2</sub> − x<sub>1</sub>'))}<p>Parallel lines have equal slopes. Perpendicular slopes are negative reciprocals.</p></div>
 <div class="reference-item"><h4>Point-slope form</h4>${math('y − y<sub>1</sub> = m(x − x<sub>1</sub>)')}<p>Substitute the slope and any known point.</p></div>
 <div class="reference-item"><h4>Formula solving</h4><p>Clear denominators, isolate the squared variable, then take square roots and include ± when appropriate.</p></div>
 <div class="reference-item"><h4>Complex numbers</h4>${math('i<sup>2</sup> = −1')}<p>Reduce higher powers of i using this rule.</p></div>
 <div class="reference-item"><h4>Investments</h4><p>Profit or interest = rate × amount. Translate “$750 more” or “$1,400 more” into an equation.</p></div>
 </div>`;
}

function freshCustomState(){ return {}; }
function normalizeCustomState(){ return {}; }
function mountTopicExtras(){}
function handleAction(){ return false; }
function handleInput(){ return false; }

const packageDef = {
 id:'lesson-090',
 number:90,
 chapter:'Chapter 12',
 title:'Differences of Two Squares',
 contentVersion:'course-package-1.0',
 sourceRevision:'lesson90-2026-10-05-photos',
 heroTitle:'Opposite signs.<br><em>Middle terms disappear.</em>',
 description:'Learn the difference-of-two-squares pattern, apply it to factoring, and work through Practice 90 and Problem Set 90 with full progress tracking.',
 heroArt:`<div class="art-caption"><span>A cancellation pattern</span><span>A factoring shortcut</span></div><div class="formula">(x + a)(x − a) = x<sup>2</sup> − a<sup>2</sup></div><div class="connector">↕</div><div class="formula">a<sup>2</sup> − b<sup>2</sup> = (a + b)(a − b)</div><p class="art-foot">Recognize the squares.<br>Use opposite signs in the factors.</p>`,
 topics,
 sections:[
  {id:'practice',label:'Practice 90',intro:'Five guided practice exercises on factoring, solving a formula, graphing a hyperbola, and an investment word problem.'},
  {id:'problem',label:'Problem Set 90',intro:'Twenty-two review exercises covering differences of two squares, graphing, line equations, formula work, complex numbers, and applications.'}
 ],
 buildQuestions,
 referenceHtml,
 freshCustomState,
 normalizeCustomState,
 mountTopicExtras,
 handleAction,
 handleInput,
 renderQuestionAsset,
 sourceStatus:{pages:'437–442',verified:'2026-10-05 lesson photos',uncertainItems:[]}
};
global.Algebra2CourseRegistry.register(packageDef);
})(window);
