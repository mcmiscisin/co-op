(function(global){
'use strict';
const E = global.Algebra2Engine;
if(!E) throw Error('Algebra2Engine must load before Lesson 92.');
const {esc,math,frac,root,panel,callout,choice,makeChoices} = E.helpers;
const Q = (id,section,label,skill,type,prompt,rest) => ({id,section,label,skill,type,prompt,...rest});

const topics = [
{
 id:'add-lcd',
 title:'Find the LCD before adding',
 short:'Adding rational expressions',
 intro:'Adding multivariable rational expressions follows the same basic rule as ordinary fractions: first make the denominators match.',
 body:
  `<p>The lesson begins with</p>${panel(frac('ax + 2a<sup>2</sup>','x<sup>2</sup> + 5ax + 6a<sup>2</sup>')+' + '+frac('x','x + 3a'))}<p>To find the lowest common denominator, factor the denominators first. The trinomial denominator factors as ${math('(x+3a)(x+2a)')}.</p>`,
 steps:[
  ['Factor the first denominator.', math('x<sup>2</sup> + 5ax + 6a<sup>2</sup> = (x+3a)(x+2a)')+'.'],
  ['Treat the second denominator as one factor.', math('x+3a')+' is already factored.'],
  ['Build the LCD.', 'The LCD is '+math('(x+3a)(x+2a)')+'.'],
  ['Rewrite the second fraction.', 'Multiply its numerator and denominator by '+math('x+2a')+'.']
 ],
 after:`${panel(frac('ax+2a<sup>2</sup>','(x+3a)(x+2a)')+' + '+frac('x(x+2a)','(x+3a)(x+2a)'),'Once the denominators match, add only the numerators.')}${callout('Factor denominators first','The LCD is easiest to see after every denominator has been factored as completely as possible.')}`,
 mini:{prompt:'What is the LCD of '+math(frac('1','x+a')+' + '+frac('1','(x+a)(x+b)'))+'?',options:['(x+a)(x+b)','x+a','(x+b)'],correct:0,explain:'The second denominator already contains both needed factors.'}
},
{
 id:'add-reduce',
 title:'After adding, simplify and factor again',
 short:'Reduce the sum',
 intro:'Matching denominators is only the middle of the problem. The combined numerator may factor and cancel.',
 body:
  `<p>After the numerators are added in the lesson example, distribution and combining like terms gives</p>${panel(frac('x<sup>2</sup> + 3ax + 2a<sup>2</sup>','(x+3a)(x+2a)'))}<p>The numerator factors as ${math('(x+2a)(x+a)')}, so a common factor can cancel.</p>`,
 steps:[
  ['Add the numerators.', math('ax+2a<sup>2</sup> + x(x+2a)')+'.'],
  ['Distribute and combine like terms.', math('x<sup>2</sup> + 3ax + 2a<sup>2</sup>')+'.'],
  ['Factor the new numerator.', math('(x+2a)(x+a)')+'.'],
  ['Cancel the common factor.', math(frac('(x+2a)(x+a)','(x+3a)(x+2a)')+' = '+frac('x+a','x+3a'))+'.']
 ],
 after:callout('A final factoring step can matter','A correct common-denominator sum may still be reducible. Always check the new numerator for a factor shared with the denominator.'),
 mini:{prompt:'Which factorization matches '+math('x<sup>2</sup>+3ax+2a<sup>2</sup>')+'?',options:['(x+a)(x+2a)','(x−a)(x−2a)','(x+3a)(x+a)'],correct:0,explain:'The two terms a and 2a multiply to 2a² and add to 3a.'}
},
{
 id:'subtract-lcd',
 title:'Subtraction also starts with the LCD',
 short:'Subtracting rational expressions',
 intro:'Subtraction uses the same denominator process, but the entire second numerator must be subtracted.',
 body:
  `<p>The lesson subtracts</p>${panel(frac('r','r+s')+' − '+frac('s<sup>2</sup>−rs','r<sup>2</sup>−s<sup>2</sup>'))}<p>Factor the difference of squares in the second denominator:</p>${panel('r<sup>2</sup>−s<sup>2</sup>=(r+s)(r−s)')}<p>The LCD is therefore ${math('(r+s)(r−s)')}.</p>`,
 steps:[
  ['Rewrite the first denominator.', 'Multiply the first fraction by '+math(frac('r−s','r−s'))+'.'],
  ['Keep the second fraction over the factored denominator.', math(frac('s<sup>2</sup>−rs','(r+s)(r−s)'))+'.'],
  ['Write one fraction.', math(frac('r(r−s) − (s<sup>2</sup>−rs)','(r+s)(r−s)'))+'.']
 ],
 after:callout('Parentheses protect the subtraction','When subtracting a multi-term numerator, put parentheses around the whole numerator before distributing the negative sign.'),
 mini:{prompt:'Factor '+math('r<sup>2</sup>−s<sup>2</sup>')+'.',options:['(r+s)(r−s)','(r−s)<sup>2</sup>','(r+s)<sup>2</sup>'],correct:0,explain:'This is a difference of two squares.'}
},
{
 id:'subtract-signs',
 title:'Distribute the negative through every term',
 short:'Sign control in subtraction',
 intro:'A common mistake is changing only the first sign of the second numerator. Every term inside the parentheses changes sign.',
 body:
  `<p>The source rewrites</p>${panel('r(r−s) − (s<sup>2</sup>−rs)')}<p>as</p>${panel('r(r−s) + (−s<sup>2</sup>+rs)')}<p>After distributing, the middle terms cancel and the numerator becomes ${math('r<sup>2</sup>−s<sup>2</sup>')}.</p>`,
 steps:[
  ['Distribute r.', math('r(r−s)=r<sup>2</sup>−rs')+'.'],
  ['Distribute the negative sign.', math('−(s<sup>2</sup>−rs)=−s<sup>2</sup>+rs')+'.'],
  ['Combine like terms.', math('−rs+rs=0')+', leaving '+math('r<sup>2</sup>−s<sup>2</sup>')+'.'],
  ['Factor and cancel.', math(frac('(r+s)(r−s)','(r+s)(r−s)')+'=1')+'.']
 ],
 after:callout('The whole subtraction example reduces to 1','The lesson’s main point is that adding and subtracting fractions with several variables still follows the familiar fraction process: LCD, combine, simplify, factor, reduce.'),
 mini:{prompt:'Simplify '+math('−(a−b)')+'.',options:['−a+b','−a−b','a+b'],correct:0,explain:'The negative changes the sign of each term inside the parentheses.'}
},
{
 id:'factor-review',
 title:'Use factoring patterns to expose common factors',
 short:'Factoring review',
 intro:'Practice and Problem Set 92 rely on earlier factoring patterns while working with rational expressions.',
 body:
  `${panel('u<sup>2</sup>−v<sup>2</sup>=(u+v)(u−v)<br>u<sup>2</sup>−2uv+v<sup>2</sup>=(u−v)<sup>2</sup>')}<p>Greatest-common-factor factoring also remains important. Rational expressions often simplify only after these factors are exposed.</p>`,
 steps:[
  ['Difference of squares.', math('x<sup>2</sup>−25=(x+5)(x−5)')+'.'],
  ['Perfect-square trinomial.', math('x<sup>2</sup>−2xy+y<sup>2</sup>=(x−y)<sup>2</sup>')+'.'],
  ['Greatest common factor.', 'Factor out the largest monomial shared by every term before looking for another pattern.']
 ],
 after:callout('Cancel factors, not terms','Factoring is what turns complicated sums and differences into cancellable products.'),
 mini:{prompt:'Factor '+math('x<sup>2</sup>−16')+'.',options:['(x+4)(x−4)','(x−4)<sup>2</sup>','(x+8)(x−8)'],correct:0,explain:'16=4², so x²−16 is a difference of two squares.'}
},
{
 id:'equations-geometry',
 title:'Keep equation and geometry tools ready',
 short:'Equation & geometry review',
 intro:'Problem Set 92 revisits equations, circles, ellipses, and coordinate lines alongside the rational-expression work.',
 body:
  `${panel('(x−h)<sup>2</sup>+(y−k)<sup>2</sup>=r<sup>2</sup><br>'+frac('(x−h)<sup>2</sup>','a<sup>2</sup>')+' + '+frac('(y−k)<sup>2</sup>','b<sup>2</sup>')+'=1')}<p>Horizontal lines have equations ${math('y=c')}; vertical lines have equations ${math('x=c')}.</p>`,
 steps:[
  ['Circle center and radius.', 'Read the center from the shifted squares and take the positive square root of the right side.'],
  ['Ellipse axes.', 'The denominators give the squared semi-axis lengths.'],
  ['Solve equations carefully.', 'Clear fractions when useful and reject any values that make an original denominator zero.']
 ],
 after:callout('Graph labels matter','For graph-selection questions, use the labeled intercepts or vertices instead of estimating from the drawing.'),
 mini:{prompt:'The equation '+math('x=−3')+' graphs as which kind of line?',options:['Vertical','Horizontal','Diagonal'],correct:0,explain:'Every point has x-coordinate −3, so the graph is vertical.'}
},
{
 id:'lines-applications',
 title:'Write line equations and relative-rate equations',
 short:'Lines & applications',
 intro:'The last problems review point-slope form and same-direction travel.',
 body:
  `${panel('y−y<sub>1</sub>=m(x−x<sub>1</sub>)<br>distance = rate × time')}<p>When two travelers move in the same direction, the distance between them grows at the difference of their speeds.</p>`,
 steps:[
  ['Known point and slope.', 'Insert both directly into point-slope form.'],
  ['Two known points.', 'Compute the slope first, then use either point.'],
  ['Same-direction travel.', 'Use '+math('(faster rate − slower rate)t = separation')+'.']
 ],
 after:callout('Relative speed saves a step','If both travelers start together and move in the same direction, their separation rate is the difference of their speeds.'),
 mini:{prompt:'A car travels 8 mph faster than another car in the same direction. How fast does their separation grow?',options:['8 mph','16 mph','the sum of both speeds'],correct:0,explain:'Same-direction separation grows at the difference of the speeds.'}
}
];

function buildQuestions(){
 const q=[];

 // Practice 92
 q.push(Q('p92-a','practice','a','Difference-of-squares factoring','choice','Select the factored form of '+math('x<sup>2</sup>−16')+'.',{
  page:449,
  choices:makeChoices(['(x+8)(x−8)','(x−8)<sup>2</sup>','(x+4)<sup>2</sup>','(x+4)(x−4)','(x−4)<sup>2</sup>']),
  correct:3,
  answerHTML:'(x+4)(x−4)',answerText:'(x+4)(x-4)',lesson:'factor-review',
  guide:['Recognize 16 as a perfect square.','Apply the difference-of-squares pattern.'],
  hints:['16=4².','Use a²−b²=(a+b)(a−b).'],
  solution:[''+math('x<sup>2</sup>−16=x<sup>2</sup>−4<sup>2</sup>')+'.',math('x<sup>2</sup>−16=(x+4)(x−4)')+'.'],
  check:'Expanding (x+4)(x−4) returns x²−16.'
 }));
 q.push(Q('p92-b','practice','b','Adding rational expressions','choice','Select the simplified form of '+math(frac('x','x+y')+' + '+frac('−xy−y<sup>2</sup>','x<sup>2</sup>+2xy+y<sup>2</sup>'))+'.',{
  page:449,
  choices:makeChoices([frac('1','x+y'),frac('x<sup>2</sup>−y<sup>2</sup>','x<sup>2</sup>+y<sup>2</sup>'),frac('x−y','x+y'),frac('x−xy−y<sup>2</sup>','x<sup>2</sup>+x+2xy+y+y<sup>2</sup>'),frac('x+y','x−y')]),
  correct:2,
  answerHTML:frac('x−y','x+y'),answerText:'(x-y)/(x+y)',lesson:'add-reduce',
  guide:['Factor the second numerator and denominator.','Use the common denominator x+y.','Combine the numerators.'],
  hints:['−xy−y²=−y(x+y).','x²+2xy+y²=(x+y)².','The second fraction reduces to −y/(x+y).'],
  solution:['Factor: '+math(frac('−y(x+y)','(x+y)<sup>2</sup>')+'='+frac('−y','x+y'))+'.','Then '+math(frac('x','x+y')+'−'+frac('y','x+y')+'='+frac('x−y','x+y'))+'.'],
  check:'This matches choice C.'
 }));
 q.push(Q('p92-c','practice','c','Subtracting rational expressions','choice','Select the simplified form of '+math(frac('a−b','a+b')+' − '+frac('a+b','a−b'))+'.',{
  page:450,
  choices:makeChoices([frac('4b<sup>2</sup>','a<sup>2</sup>−b<sup>2</sup>'),'0',frac('−2b','a<sup>2</sup>−b<sup>2</sup>'),frac('−4ab','a<sup>2</sup>−b<sup>2</sup>'),frac('−4ab','a<sup>2</sup>+b<sup>2</sup>')]),
  correct:3,
  answerHTML:frac('−4ab','a<sup>2</sup>−b<sup>2</sup>'),answerText:'-4ab/(a^2-b^2)',lesson:'subtract-signs',
  guide:['Use the LCD (a+b)(a−b).','Subtract the entire second numerator.','Expand and combine like terms.'],
  hints:['The numerator becomes (a−b)²−(a+b)².','The a² and b² terms cancel, leaving −4ab.'],
  solution:['Use the common denominator '+math('(a+b)(a−b)=a<sup>2</sup>−b<sup>2</sup>')+'.','The numerator is '+math('(a−b)<sup>2</sup>−(a+b)<sup>2</sup>=−4ab')+'.','So the simplified result is '+math(frac('−4ab','a<sup>2</sup>−b<sup>2</sup>'))+'.'],
  check:'This matches choice D.'
 }));
 q.push(Q('p92-d','practice','d','Solving a rational formula for w','choice','Which choice represents '+math('c='+frac('a+w','b+w'))+' after it has been solved for '+math('w')+'?',{
  page:450,
  choices:makeChoices(['w='+frac('a−bc','c−1'),'w=abc−bc<sup>2</sup>−a+bc','w=b+c−a','w='+frac('a+bc','c+1'),'w='+frac('bc−a','2')]),
  correct:0,
  answerHTML:'w='+frac('a−bc','c−1'),answerText:'w=(a-bc)/(c-1)',lesson:'equations-geometry',
  guide:['Multiply by b+w.','Gather the w terms on one side.','Factor w and divide.'],
  hints:['c(b+w)=a+w.','cw−w=a−bc.','w(c−1)=a−bc.'],
  solution:[''+math('cb+cw=a+w')+'.','Move terms: '+math('cw−w=a−bc')+'.','Factor: '+math('w(c−1)=a−bc')+'.','Therefore '+math('w='+frac('a−bc','c−1'))+'.'],
  check:'This matches choice A, assuming the original denominators are defined.'
 }));
 q.push(Q('p92-e','practice','e','Same-direction travel','numeric','Melanie and Luther leave the same spot at the same time and travel in the same direction. Melanie travels at 67 mph and Luther at 55 mph. How many hours will it be before Melanie is 15 miles ahead of Luther? Write the answer as a decimal.',{
  page:450,
  fields:[{key:'time',label:'Time',suffix:'hours',placeholder:'decimal',value:1.25,tolerance:1e-9}],
  answerHTML:'1.25 hours',answerText:'1.25',lesson:'lines-applications',
  guide:['Find the difference in their speeds.','Use separation = relative speed × time.'],
  hints:['67−55=12 mph.','12t=15.'],
  solution:['Their separation grows at '+math('12')+' mph.','Solve '+math('12t=15')+'.',''+math('t='+frac('15','12')+'=1.25')+' hours.'],
  check:'After 1.25 hours, the distance difference is 12×1.25=15 miles.'
 }));

 // Problem Set 92
 q.push(Q('ps92-1','problem','1','Order of operations','numeric','Calculate '+math('(4)(−3)<sup>2</sup> + 2<sup>2</sup> − 4<sup>2</sup>')+'.',{
  page:450,fields:[{key:'value',label:'Value',placeholder:'number',value:24,tolerance:1e-9}],
  answerHTML:'24',answerText:'24',lesson:'equations-geometry',
  guide:['Evaluate exponents first.','Multiply, then add and subtract.'],
  hints:['(−3)²=9, 2²=4, 4²=16.'],
  solution:[math('4·9+4−16=36+4−16=24')+'.']
 }));
 q.push(Q('ps92-2','problem','2','Order of operations','numeric','Calculate '+math(frac('(−4)<sup>2</sup> + 2<sup>3</sup> + 10<sup>0</sup>','−(3+2)<sup>2</sup>'))+'.',{
  page:450,fields:[{key:'value',label:'Value',placeholder:'number',value:-1,tolerance:1e-9}],
  answerHTML:'−1',answerText:'-1',lesson:'equations-geometry',
  guide:['Evaluate powers in numerator and denominator.','Apply the negative sign outside the denominator square.'],
  hints:['Numerator: 16+8+1=25.','Denominator: −25.'],
  solution:[math(frac('25','−25')+'=−1')+'.']
 }));
 q.push(Q('ps92-3','problem','3','Parallel or perpendicular lines','choice','Tell whether the lines '+math('y=−6')+' and '+math('y=3')+' are parallel or perpendicular.',{
  page:450,choices:makeChoices(['Parallel','Perpendicular','Neither']),correct:0,
  answerHTML:'Parallel',answerText:'Parallel',lesson:'equations-geometry',
  guide:['Identify the slope of each horizontal line.'],
  hints:['Both lines are horizontal and have slope 0.'],
  solution:['Both equations have the form '+math('y=c')+', so both lines are horizontal. Distinct horizontal lines are parallel.']
 }));
 q.push(Q('ps92-4','problem','4','Circle center and radius','numeric','Tell the center and radius of the circle '+math('(x+7)<sup>2</sup> + (y−2)<sup>2</sup> = 100')+'.',{
  page:450,
  fields:[
   {key:'cx',label:'Center x',placeholder:'number',value:-7,tolerance:1e-9},
   {key:'cy',label:'Center y',placeholder:'number',value:2,tolerance:1e-9},
   {key:'r',label:'Radius',placeholder:'number',value:10,tolerance:1e-9}
  ],
  answerHTML:'Center (−7, 2); radius 10',answerText:'center (-7,2), radius 10',lesson:'equations-geometry',
  guide:['Compare with (x−h)²+(y−k)²=r².','Remember that x+7 means x−(−7).'],
  hints:['h=−7 and k=2.','r=√100=10.'],
  solution:['The center is '+math('(−7,2)')+' and the radius is '+math('10')+'.']
 }));
 q.push(Q('ps92-5','problem','5','Greatest-common-factor factoring','choice','Select the factored form of '+math('x<sup>3</sup>yz − xy<sup>2</sup>z<sup>2</sup>')+'.',{
  page:450,
  choices:makeChoices(['xy<sup>2</sup>z<sup>2</sup>(x<sup>2</sup>yz−1)','xyz(x−yz)','x<sup>3</sup>yz(1−x<sup>2</sup>yz)','xyz(x<sup>2</sup>−yz)','x<sup>2</sup>yz(x−yz)']),
  correct:3,
  answerHTML:'xyz(x<sup>2</sup>−yz)',answerText:'xyz(x^2-yz)',lesson:'factor-review',
  guide:['Find the greatest common monomial factor.','Divide each term by that factor.'],
  hints:['Both terms contain xyz.','x³yz ÷ xyz = x².','xy²z² ÷ xyz = yz.'],
  solution:['Factor out '+math('xyz')+': '+math('x<sup>3</sup>yz−xy<sup>2</sup>z<sup>2</sup>=xyz(x<sup>2</sup>−yz)')+'.'],
  check:'This matches choice D.'
 }));
 q.push(Q('ps92-6','problem','6','Difference-of-squares factoring','choice','Select the factored form of '+math('x<sup>2</sup>−25')+'.',{
  page:450,
  choices:makeChoices(['(x+5)<sup>2</sup>','(x+5)(x−5)','(x−5)<sup>2</sup>','(x−12.5)<sup>2</sup>','(x+12.5)(x−12.5)']),
  correct:1,
  answerHTML:'(x+5)(x−5)',answerText:'(x+5)(x-5)',lesson:'factor-review',
  guide:['Recognize 25 as 5².'],
  hints:['Use x²−5².'],
  solution:[math('x<sup>2</sup>−25=(x+5)(x−5)')+'.'],
  check:'This matches choice B.'
 }));
 q.push(Q('ps92-7','problem','7','Perfect-square trinomial','choice','Select the factored form of '+math('x<sup>2</sup>−2xy+y<sup>2</sup>')+'.',{
  page:450,
  choices:makeChoices(['(x+y)(x−y)','(x+1)(y+1)','(x−y)<sup>2</sup>','(x−y)(y+1)','(x+y)<sup>2</sup>']),
  correct:2,
  answerHTML:'(x−y)<sup>2</sup>',answerText:'(x-y)^2',lesson:'factor-review',
  guide:['Compare with u²−2uv+v².'],
  hints:['The middle term is −2xy.'],
  solution:[math('x<sup>2</sup>−2xy+y<sup>2</sup>=(x−y)<sup>2</sup>')+'.'],
  check:'This matches choice C.'
 }));
 q.push(Q('ps92-8','problem','8','Multiplying monomials','choice','Select the simplified form of '+math('(9ax<sup>2</sup>y<sup>3</sup>z)(3bx<sup>3</sup>y<sup>5</sup>z<sup>2</sup>)')+'.',{
  page:450,
  choices:makeChoices(['27abx<sup>3</sup>y<sup>8</sup>z<sup>2</sup>','27abx<sup>5</sup>y<sup>8</sup>z<sup>3</sup>','27abx<sup>6</sup>y<sup>15</sup>z<sup>2</sup>','12abx<sup>5</sup>y<sup>8</sup>z<sup>3</sup>','12abx<sup>6</sup>y<sup>15</sup>z<sup>2</sup>']),
  correct:1,
  answerHTML:'27abx<sup>5</sup>y<sup>8</sup>z<sup>3</sup>',answerText:'27abx^5y^8z^3',lesson:'factor-review',
  guide:['Multiply coefficients.','Add exponents on matching bases.'],
  hints:['9·3=27.','x²·x³=x⁵, y³·y⁵=y⁸, z·z²=z³.'],
  solution:[math('(9)(3)=27')+', '+math('x<sup>2+3</sup>=x<sup>5</sup>')+', '+math('y<sup>3+5</sup>=y<sup>8</sup>')+', and '+math('z<sup>1+2</sup>=z<sup>3</sup>')+'.'],
  check:'This matches choice B.'
 }));
 q.push(Q('ps92-9','problem','9','Expanding a squared sum','choice','Select the simplified form of '+math('(u+v)(u+v)')+'.',{
  page:451,
  choices:makeChoices(['u<sup>2</sup>+2uv+v<sup>2</sup>','u<sup>2</sup>+v<sup>2</sup>','u<sup>2</sup>−2uv+v<sup>2</sup>','2u+2v','u<sup>2</sup>−v<sup>2</sup>']),
  correct:0,
  answerHTML:'u<sup>2</sup>+2uv+v<sup>2</sup>',answerText:'u^2+2uv+v^2',lesson:'factor-review',
  guide:['Multiply each term in the first binomial by each term in the second.'],
  hints:['The two middle products are uv and uv.'],
  solution:[math('(u+v)<sup>2</sup>=u<sup>2</sup>+2uv+v<sup>2</sup>')+'.'],
  check:'This matches choice A.'
 }));
 q.push(Q('ps92-10','problem','10','Reducing a rational expression','choice','Select the simplified form of '+math(frac('bx<sup>3</sup>+abx<sup>2</sup>','x<sup>2</sup>−a<sup>2</sup>'))+'.',{
  page:451,
  choices:makeChoices([frac('bx','x−a'),frac('b+x','x+a'),frac('bx<sup>2</sup>','x+a'),frac('x<sup>2</sup>','x−a'),frac('bx<sup>2</sup>','x−a')]),
  correct:4,
  answerHTML:frac('bx<sup>2</sup>','x−a'),answerText:'bx^2/(x-a)',lesson:'add-reduce',
  guide:['Factor the numerator and denominator.','Cancel the common factor x+a.'],
  hints:['bx³+abx²=bx²(x+a).','x²−a²=(x+a)(x−a).'],
  solution:[math(frac('bx<sup>2</sup>(x+a)','(x+a)(x−a)')+'='+frac('bx<sup>2</sup>','x−a'))+'.'],
  check:'This matches choice E.'
 }));
 q.push(Q('ps92-11','problem','11','Dividing rational expressions','choice','Select the simplified form of '+math(frac('42x<sup>2</sup>y<sup>2</sup>','5x+10y')+' ÷ '+frac('84x<sup>2</sup>','3x+6y'))+'.',{
  page:451,
  choices:makeChoices([frac('63x<sup>4</sup>y<sup>2</sup>','4x+8y'),frac('1,176x<sup>4</sup>y<sup>2</sup>','5'),frac('6x<sup>2</sup>y<sup>2</sup>','5'),frac('3y<sup>2</sup>','10'),frac('3y<sup>2</sup>','7')]),
  correct:3,
  answerHTML:frac('3y<sup>2</sup>','10'),answerText:'3y^2/10',lesson:'add-reduce',
  guide:['Factor 5x+10y and 3x+6y.','Invert the second fraction and multiply.','Cancel common factors.'],
  hints:['5x+10y=5(x+2y).','3x+6y=3(x+2y).'],
  solution:[math(frac('42x<sup>2</sup>y<sup>2</sup>','5(x+2y)')+' · '+frac('3(x+2y)','84x<sup>2</sup>'))+'.','Cancel '+math('x<sup>2</sup>')+' and '+math('(x+2y)')+'; reduce '+math(frac('126','420')+'='+frac('3','10'))+'.','Result: '+math(frac('3y<sup>2</sup>','10'))+'.'],
  check:'This matches choice D.'
 }));
 q.push(Q('ps92-12','problem','12','Adding rational expressions','choice','Select the simplified form of '+math(frac('a','a+b')+' + '+frac('−ab−b<sup>2</sup>','a<sup>2</sup>+2ab+b<sup>2</sup>'))+'.',{
  page:451,
  choices:makeChoices([frac('a−b','a+b'),frac('a−ab−b<sup>2</sup>','a<sup>2</sup>+a+2ab+b+b<sup>2</sup>'),frac('a+b','a−b'),frac('1','a+b'),frac('a<sup>2</sup>−b<sup>2</sup>','a<sup>2</sup>+b<sup>2</sup>')]),
  correct:0,
  answerHTML:frac('a−b','a+b'),answerText:'(a-b)/(a+b)',lesson:'add-reduce',
  guide:['Factor the second numerator and denominator.','Reduce the second fraction first.','Combine over a+b.'],
  hints:['−ab−b²=−b(a+b).','a²+2ab+b²=(a+b)².'],
  solution:['The second fraction reduces to '+math(frac('−b','a+b'))+'.','Then '+math(frac('a','a+b')+'−'+frac('b','a+b')+'='+frac('a−b','a+b'))+'.'],
  check:'This matches choice A.'
 }));
 q.push(Q('ps92-13','problem','13','Subtracting rational expressions','choice','Select the simplified form of '+math(frac('r−s','r+s')+' − '+frac('r+s','r−s'))+'.',{
  page:451,
  choices:makeChoices([frac('4s<sup>2</sup>','r<sup>2</sup>−s<sup>2</sup>'),frac('−4rs','r<sup>2</sup>−s<sup>2</sup>'),frac('−4rs','r<sup>2</sup>+s<sup>2</sup>'),frac('−2s','r<sup>2</sup>−s<sup>2</sup>'),'0']),
  correct:1,
  answerHTML:frac('−4rs','r<sup>2</sup>−s<sup>2</sup>'),answerText:'-4rs/(r^2-s^2)',lesson:'subtract-signs',
  guide:['Use LCD (r+s)(r−s).','Subtract the second numerator carefully.'],
  hints:['The numerator is (r−s)²−(r+s)².','That simplifies to −4rs.'],
  solution:[''+math(frac('(r−s)<sup>2</sup>−(r+s)<sup>2</sup>','(r+s)(r−s)'))+'.','The numerator simplifies to '+math('−4rs')+' and the denominator is '+math('r<sup>2</sup>−s<sup>2</sup>')+'.'],
  check:'This matches choice B.'
 }));
 q.push(Q('ps92-14','problem','14','Solving a linear equation','numeric','Solve '+math('5z−4(z−3)=7z')+'.',{
  page:451,
  fields:[{key:'z',label:'z',placeholder:'number',value:2,tolerance:1e-9}],
  answerHTML:'z = 2',answerText:'2',lesson:'equations-geometry',
  guide:['Distribute −4.','Collect z terms.'],
  hints:['5z−4z+12=7z.','12=6z.'],
  solution:[math('z+12=7z')+', so '+math('12=6z')+' and '+math('z=2')+'.'],
  check:'Both sides equal 14 when z=2.'
 }));
 q.push(Q('ps92-15','problem','15','Solving a rational equation','numeric','Solve '+math(frac('x','x−2')+' = '+frac('1','3')+' + 1')+'.',{
  page:451,
  fields:[{key:'x',label:'x',placeholder:'number',value:8,tolerance:1e-9}],
  answerHTML:'x = 8',answerText:'8',lesson:'equations-geometry',
  guide:['Combine 1/3 + 1.','Cross-multiply or clear denominators.','Check the original denominator.'],
  hints:['1/3+1=4/3.','3x=4(x−2).'],
  solution:[math('3x=4x−8')+', so '+math('x=8')+'.'],
  check:'x=8 does not make x−2 zero and satisfies the original equation.'
 }));
 q.push(Q('ps92-16','problem','16','Substitution into a radical formula','numeric','In '+math('z='+root('36−x<sup>2</sup>−y<sup>2</sup>'))+', find '+math('z')+' when '+math('x=2')+' and '+math('y=4')+'.',{
  page:451,
  fields:[{key:'z',label:'z',placeholder:'number',value:4,tolerance:1e-9}],
  answerHTML:'z = 4',answerText:'4',lesson:'equations-geometry',
  guide:['Substitute x and y.','Evaluate the squares and simplify under the radical.'],
  hints:['36−2²−4²=36−4−16.'],
  solution:[math('z='+root('16')+'=4')+'.']
 }));
 q.push(Q('ps92-17','problem','17','Solving a rational formula for m','choice','Which choice represents '+math('z='+frac('x+m','y+m'))+' after it has been solved for '+math('m')+'?',{
  page:451,
  choices:makeChoices(['m=y+z−x','m='+frac('x+zy','z+1'),'m='+frac('zy−x','2'),'m=xyz−yz<sup>2</sup>−x+yz','m='+frac('x−zy','z−1')]),
  correct:4,
  answerHTML:'m='+frac('x−zy','z−1'),answerText:'m=(x-zy)/(z-1)',lesson:'equations-geometry',
  guide:['Multiply both sides by y+m.','Collect the m terms.','Factor and divide.'],
  hints:['zy+zm=x+m.','m(z−1)=x−zy.'],
  solution:[''+math('zy+zm=x+m')+'.','Move terms to get '+math('zm−m=x−zy')+'.','Factor '+math('m(z−1)=x−zy')+' and divide: '+math('m='+frac('x−zy','z−1'))+'.'],
  check:'This matches choice E.'
 }));
 q.push(Q('ps92-18','problem','18','Selecting the graph of a vertical line','choice','Select the graph of '+math('x=−3')+'.',{
  page:452,
  asset:'graph18',
  choices:makeChoices(['Graph A','Graph B','Graph C','Graph D','Graph E']),
  correct:1,
  answerHTML:'Graph B',answerText:'Graph B',lesson:'equations-geometry',
  guide:['x=constant means a vertical line.','Use the sign and coordinate label.'],
  hints:['The line must pass through (−3,0).'],
  solution:['The equation '+math('x=−3')+' is a vertical line through every point whose x-coordinate is −3.','That matches <strong>Graph B</strong>.'],
  check:'Graph B is vertical and passes through (−3,0).'
 }));
 q.push(Q('ps92-19','problem','19','Selecting the graph of an ellipse','choice','Select the graph of '+math(frac('x<sup>2</sup>','16')+' + '+frac('y<sup>2</sup>','25')+' = 1')+'.',{
  page:452,
  asset:'graph19',
  choices:makeChoices(['Graph A','Graph B','Graph C','Graph D','Graph E']),
  correct:3,
  answerHTML:'Graph D',answerText:'Graph D',lesson:'equations-geometry',
  guide:['Find the center.','Take square roots of 16 and 25.','Identify the longer axis.'],
  hints:['Center is (0,0).','Horizontal semi-axis is 4; vertical semi-axis is 5.'],
  solution:['The ellipse is centered at the origin with x-intercepts '+math('(±4,0)')+' and y-intercepts '+math('(0,±5)')+'.','That matches <strong>Graph D</strong>.'],
  check:'The larger denominator is under y², so the ellipse is taller than it is wide.'
 }));
 q.push(Q('ps92-20','problem','20','Equation from a point and slope','choice','Select the equation for the line crossing '+math('(0,−2)')+' with slope '+math('−'+frac('5','9'))+'.',{
  page:453,
  choices:makeChoices([
   'y−2=−'+frac('5','9')+'(x−0)',
   'y=−'+frac('5','9')+'(x+2)',
   'y=−'+frac('5','9')+'x+2',
   'y=−'+frac('5','9')+'(x−2)',
   'y=−'+frac('5','9')+'x+(−2)'
  ]),
  correct:4,
  answerHTML:'y=−'+frac('5','9')+'x−2',answerText:'y=-(5/9)x-2',lesson:'lines-applications',
  guide:['Use the slope and the point.','Since x=0 at the given point, the y-coordinate is the intercept.'],
  hints:['The y-intercept is −2.'],
  solution:['A line with slope '+math('−'+frac('5','9'))+' and y-intercept −2 is '+math('y=−'+frac('5','9')+'x−2')+'.'],
  check:'This is choice E.'
 }));
 q.push(Q('ps92-21','problem','21','Equation through two points','choice','Select the equation for the line crossing '+math('(1,−4)')+' and '+math('(2,−6)')+'.',{
  page:453,
  choices:makeChoices([
   'y−2=−2(x+6)',
   'y+4=−4(x−1)',
   'y+6=−2(x−2)',
   'y−1=−3(x+4)',
   'y−6=−2(x+2)'
  ]),
  correct:2,
  answerHTML:'y+6=−2(x−2)',answerText:'y+6=-2(x-2)',lesson:'lines-applications',
  guide:['Compute the slope from the two points.','Use point-slope form with either point.'],
  hints:['m=(−6−(−4))/(2−1)=−2.','Using (2,−6) gives y+6=−2(x−2).'],
  solution:['The slope is '+math('−2')+'.','Using point '+math('(2,−6)')+', point-slope form gives '+math('y+6=−2(x−2)')+'.'],
  check:'This is choice C.'
 }));
 q.push(Q('ps92-22','problem','22','Same-direction travel','numeric','Lola and Nick leave the same spot at the same time and travel in the same direction. Lola travels at 62 mph and Nick at 54 mph. How many hours will it be before Lola is 14 miles ahead of Nick? Write the answer as a decimal.',{
  page:453,
  fields:[{key:'time',label:'Time',suffix:'hours',placeholder:'decimal',value:1.75,tolerance:1e-9}],
  answerHTML:'1.75 hours',answerText:'1.75',lesson:'lines-applications',
  guide:['Find the relative speed.','Set relative-speed distance equal to 14 miles.'],
  hints:['62−54=8 mph.','8t=14.'],
  solution:['Their separation grows at '+math('8')+' mph.','Solve '+math('8t=14')+'.',''+math('t='+frac('14','8')+'=1.75')+' hours.'],
  check:'8×1.75=14 miles.'
 }));

 return q;
}

function miniGraphLine(kind){
 const W=260,H=220,ox=130,oy=110,s=20;
 const X=x=>ox+x*s,Y=y=>oy-y*s;
 let g='';
 for(let i=-5;i<=5;i++){
  g+=`<line x1="${X(i)}" y1="20" x2="${X(i)}" y2="200" stroke="#ecece4"/>`;
  g+=`<line x1="30" y1="${Y(i)}" x2="230" y2="${Y(i)}" stroke="#ecece4"/>`;
 }
 g+=`<line x1="25" y1="${oy}" x2="235" y2="${oy}" stroke="#263b40" stroke-width="2"/><line x1="${ox}" y1="15" x2="${ox}" y2="205" stroke="#263b40" stroke-width="2"/>`;
 if(kind==='A')g+=`<line x1="25" y1="${Y(3)}" x2="235" y2="${Y(3)}" stroke="#17685f" stroke-width="4"/><circle cx="${X(0)}" cy="${Y(3)}" r="5" fill="#17685f"/><text x="${X(0)+7}" y="${Y(3)+16}" font-size="14">(0,3)</text>`;
 if(kind==='B')g+=`<line x1="${X(-3)}" y1="15" x2="${X(-3)}" y2="205" stroke="#17685f" stroke-width="4"/><circle cx="${X(-3)}" cy="${Y(0)}" r="5" fill="#17685f"/><text x="${X(-3)-42}" y="${Y(0)+18}" font-size="14">(−3,0)</text>`;
 if(kind==='C')g+=`<line x1="25" y1="${Y(-3)}" x2="235" y2="${Y(-3)}" stroke="#17685f" stroke-width="4"/><circle cx="${X(0)}" cy="${Y(-3)}" r="5" fill="#17685f"/><text x="${X(0)+7}" y="${Y(-3)+18}" font-size="14">(0,−3)</text>`;
 if(kind==='D')g+=`<line x1="${X(-5)}" y1="${Y(8)}" x2="${X(5)}" y2="${Y(-2)}" stroke="#17685f" stroke-width="4"/><circle cx="${X(0)}" cy="${Y(3)}" r="5" fill="#17685f"/><circle cx="${X(3)}" cy="${Y(0)}" r="5" fill="#17685f"/><text x="${X(0)+7}" y="${Y(3)-7}" font-size="13">(0,3)</text><text x="${X(3)+7}" y="${Y(0)+18}" font-size="13">(3,0)</text>`;
 if(kind==='E')g+=`<line x1="${X(3)}" y1="15" x2="${X(3)}" y2="205" stroke="#17685f" stroke-width="4"/><circle cx="${X(3)}" cy="${Y(0)}" r="5" fill="#17685f"/><text x="${X(3)+6}" y="${Y(0)+18}" font-size="14">(3,0)</text>`;
 return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Graph ${kind}">${g}</svg>`;
}

function miniGraphEllipse(kind){
 const W=260,H=220,ox=130,oy=110,s=16;
 const X=x=>ox+x*s,Y=y=>oy-y*s;
 let rx,ry,label='';
 if(kind==='A'){rx=Math.sqrt(5)*s;ry=2*s;label='x=±√5, y=±2';}
 if(kind==='B'){rx=5*s;ry=4*s;label='x=±5, y=±4';}
 if(kind==='C'){rx=2*s;ry=4*s;label='x=±2, y=±4';}
 if(kind==='D'){rx=4*s;ry=5*s;label='x=±4, y=±5';}
 if(kind==='E'){rx=2*s;ry=Math.sqrt(5)*s;label='x=±2, y=±√5';}
 let g=`<line x1="25" y1="${oy}" x2="235" y2="${oy}" stroke="#263b40" stroke-width="2"/><line x1="${ox}" y1="15" x2="${ox}" y2="205" stroke="#263b40" stroke-width="2"/><ellipse cx="${ox}" cy="${oy}" rx="${rx}" ry="${ry}" fill="none" stroke="#17685f" stroke-width="4"/><circle cx="${ox}" cy="${oy}" r="4" fill="#263b40"/><text x="10" y="210" font-size="13">${label}</text>`;
 return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Ellipse graph ${kind}: ${label}">${g}</svg>`;
}

function graphChoiceGrid(kind){
 const maker=kind==='line'?miniGraphLine:miniGraphEllipse;
 return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:18px 0">${['A','B','C','D','E'].map(k=>`<figure style="margin:0;border:1px solid var(--line);border-radius:12px;background:#fff;padding:8px"><figcaption style="font-weight:700;margin-bottom:4px">Graph ${k}</figcaption>${maker(k)}</figure>`).join('')}</div>`;
}

function renderQuestionAsset(q){
 if(q.asset==='graph18') return graphChoiceGrid('line');
 if(q.asset==='graph19') return graphChoiceGrid('ellipse');
 return '';
}

function referenceHtml(){return `<p>Use this sheet while you work. It summarizes Lesson 92 methods without giving the exercise answers.</p><div class="reference-grid">
 <div class="reference-item"><h4>Adding rational expressions</h4><p>Factor denominators, find the LCD, rewrite each fraction, add numerators, then simplify and reduce.</p></div>
 <div class="reference-item"><h4>Subtracting rational expressions</h4><p>Use an LCD, then subtract the <strong>entire</strong> second numerator. Distribute the negative sign to every term.</p></div>
 <div class="reference-item"><h4>Difference of squares</h4>${math('u<sup>2</sup>−v<sup>2</sup>=(u+v)(u−v)')}</div>
 <div class="reference-item"><h4>Perfect-square trinomial</h4>${math('u<sup>2</sup>−2uv+v<sup>2</sup>=(u−v)<sup>2</sup>')}</div>
 <div class="reference-item"><h4>Circle</h4>${math('(x−h)<sup>2</sup>+(y−k)<sup>2</sup>=r<sup>2</sup>')}<p>Center (h,k), radius r.</p></div>
 <div class="reference-item"><h4>Ellipse</h4>${math(frac('x<sup>2</sup>','a<sup>2</sup>')+'+'+frac('y<sup>2</sup>','b<sup>2</sup>')+'=1')}<p>Square roots of the denominators give the semi-axis lengths.</p></div>
 <div class="reference-item"><h4>Vertical & horizontal lines</h4><p>${math('x=c')} is vertical; ${math('y=c')} is horizontal.</p></div>
 <div class="reference-item"><h4>Point-slope form</h4>${math('y−y<sub>1</sub>=m(x−x<sub>1</sub>)')}</div>
 <div class="reference-item"><h4>Relative speed</h4><p>Same direction: separation rate = faster speed − slower speed.</p></div>
 </div>`;}

function freshCustomState(){return{};}
function normalizeCustomState(){return{};}
function mountTopicExtras(){}
function handleAction(){return false;}
function handleInput(){return false;}

const packageDef={
 id:'lesson-092',
 number:92,
 chapter:'Chapter 12',
 title:'Adding and Subtracting Rational Expressions with Several Variables',
 contentVersion:'course-package-1.0',
 sourceRevision:'lesson92-2026-10-07-photos',
 heroTitle:'Match denominators.<br><em>Control every sign.</em>',
 description:'Add and subtract rational expressions with several variables, reduce the results by factoring, and complete the mixed Practice 92 and Problem Set 92 review.',
 heroArt:`<div class="art-caption"><span>Factor denominators</span><span>Find the LCD</span></div><div class="formula">${frac('A','M')} ± ${frac('B','N')}</div><div class="connector">↓</div><div class="formula">common denominator → combine numerators → factor → reduce</div><p class="art-foot">The fraction rules do not change just because several variables are present.</p>`,
 topics,
 sections:[
  {id:'practice',label:'Practice 92',intro:'Five exercises on factoring, rational-expression addition/subtraction, formula rearrangement, and same-direction travel.'},
  {id:'problem',label:'Problem Set 92',intro:'Twenty-two review exercises covering rational expressions, factoring, equations, coordinate geometry, graph selection, line equations, and applications.'}
 ],
 buildQuestions,
 referenceHtml,
 freshCustomState,
 normalizeCustomState,
 mountTopicExtras,
 handleAction,
 handleInput,
 renderQuestionAsset,
 sourceStatus:{pages:'448–453',verified:'2026-10-07 two-batch photo set',uncertainItems:[]}
};
global.Algebra2CourseRegistry.register(packageDef);
})(window);
