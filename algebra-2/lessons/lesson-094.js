(function(global){
'use strict';
const E=global.Algebra2Engine;
if(!E) throw Error('Algebra2Engine must load before Lesson 94.');
const {esc,math,frac,root,panel,callout,makeChoices}=E.helpers;
const Q=(id,section,label,skill,type,prompt,rest)=>({id,section,label,skill,type,prompt,...rest});
const system=(a,b)=>panel(a+'<br>'+b);
const field=(key,label,value,suffix='')=>({key,label,placeholder:'number',value,tolerance:1e-9,...(suffix?{suffix}:{})});
// IMG_4387 contains Problem Set 19–22, but its page-number footer is cropped.
// Those questions use sourcePhoto instead of an inferred numeric page field.
const finalSource={sourcePhoto:'IMG_4387.jpeg',sourceLocation:'Lesson 94 continuation; printed page number not visible'};

const topics=[
{
 id:'system-model',title:'Two unknowns, two equations',short:'What is a system?',
 intro:'A system groups equations that describe the same problem. A solution must satisfy every equation in that group.',
 body:'<p>In the source example, Joe buys 3 pencil packages and 4 notepads for $15.20. Shelly buys 3 pencil packages and 7 notepads for $20.30. Let '+math('x')+' be the pencil-package price and '+math('y')+' the notepad price.</p>'+system('3x+4y=15.20','3x+7y=20.30'),
 steps:[['Define both unknowns.','Use one variable for each unit price.'],['Translate each purchase.','Quantity × unit price gives the cost of that item.'],['Keep the equations together.','Both purchases use the same x and y. A solution is one pair that makes both totals correct.']],
 after:callout('Linear systems','Here both equations are first degree. Satisfying only one equation does not solve the system.'),
 mini:{prompt:'What must a solution of a two-equation system do?',options:['Satisfy both equations','Satisfy just the first equation','Make x equal y'],correct:0,explain:'The same pair of values must work in both equations.'}
},
{
 id:'subtract',title:'Eliminate matching terms by subtraction',short:'Subtract equations',
 intro:'When one variable has identical coefficients, subtracting the equations removes that variable.',
 body:system('3x+4y=15.20','3x+7y=20.30')+'<p>Subtract the first equation from the second. Subtract the entire left side and the entire right side:</p>'+panel('(3x+7y)−(3x+4y)=20.30−15.20'),
 steps:[['Align like terms.','Keep x terms, y terms, and constants in matching columns.'],['Distribute the subtraction sign.',math('3x+7y−3x−4y=5.10')+'. Every term in the subtracted expression changes sign.'],['Combine and solve.',math('3y=5.10')+', so '+math('y=1.70')+'.']],
 after:callout('Either subtraction order works','Subtracting second from first instead gives −3y=−5.10. It produces the same y value.'),
 mini:{prompt:'To eliminate equal 3x terms in two equations, which operation works?',options:['Subtract','Add','Multiply the left sides only'],correct:0,explain:'3x−3x=0. Subtract the right sides as well.'}
},
{
 id:'recover-check',title:'Find the other unknown and check both equations',short:'Substitute & check',
 intro:'Elimination finds one variable. Substitute that value into an original equation to find the other.',
 body:'<p>With '+math('y=1.70')+', use the simpler original equation:</p>'+panel('3x+4(1.70)=15.20'),
 steps:[['Substitute.',math('3x+6.80=15.20')+'.'],['Solve for the remaining variable.',math('3x=8.40')+', so '+math('x=2.80')+'.'],['Check the first equation.',math('3(2.80)+4(1.70)=8.40+6.80=15.20')+'.'],['Check the second equation.',math('3(2.80)+7(1.70)=8.40+11.90=20.30')+'.'],['Interpret the values.','A pencil package costs $2.80 and a notepad costs $1.70.']],
 after:callout('Check the original system','Checking only the equation produced by elimination is insufficient. Use both originals.'),
 mini:{prompt:'After finding y, where should you substitute it to find x?',options:['Into either original equation','Only into 3y=5.10','Nowhere; the system is already solved'],correct:0,explain:'An original equation still contains x and can determine its value.'}
},
{
 id:'add-or-subtract',title:'Add opposite terms; subtract equal terms',short:'Choose elimination',
 intro:'Choose the operation that makes a variable cancel. Opposite coefficients call for addition.',
 body:system('7x+2y=29','3x−2y=1')+'<p>Subtracting would leave '+math('4x+4y=28')+', so neither variable would disappear. Adding eliminates y instead.</p>',
 steps:[['Inspect the coefficients.',math('+2y')+' and '+math('−2y')+' are opposites.'],['Add corresponding sides.',math('10x+0y=30')+', so '+math('x=3')+'.'],['Recover y.',math('7(3)+2y=29')+' gives '+math('2y=8')+' and '+math('y=4')+'.'],['Check both equations.',math('7(3)+2(4)=29')+' and '+math('3(3)−2(4)=1')+'.']],
 after:callout('Decision rule','Equal terms cancel when subtracted. Opposite terms cancel when added. In vertical work, preserve the signs of each term.'),
 mini:{prompt:'The y terms are +5y and +5y. Which operation eliminates y?',options:['Subtract','Add','Neither'],correct:0,explain:'5y−5y=0.'}
},
{
 id:'algebra-review',title:'Factor, multiply, and simplify rational expressions',short:'Algebra review',
 intro:'The review exercises use grouping, square patterns, exponent rules, and rational-expression operations.',
 body:panel('A<sup>2</sup>−B<sup>2</sup>=(A+B)(A−B)<br>(A−B)<sup>2</sup>=A<sup>2</sup>−2AB+B<sup>2</sup>')+'<p>For grouping, collect terms that reveal the same binomial. For rational expressions, factor denominators before choosing a common denominator or taking a reciprocal.</p>',
 steps:[['Group and factor.','For Practice a, cd(x−y)+r(x−y) has common factor x−y.'],['Multiply monomials.','Multiply coefficients and add exponents of matching variables.'],['Add fractions.','Use one denominator; multiply the numerator as well when scaling a fraction.'],['Divide fractions.','Multiply by the reciprocal of the second fraction, then cancel factors.'],['Preserve restrictions.','Original denominators and the divisor must remain nonzero.']],
 after:callout('Cancel factors, not terms','A sum in a numerator cannot be canceled one term at a time with a denominator.'),
 mini:{prompt:'When multiplying x⁴ by x, what is the resulting power?',options:['x⁵','x⁴','x⁸'],correct:0,explain:'Add the exponents: 4+1=5.'}
},
{
 id:'complex-formulas',title:'Use i²=−1 and isolate the requested variable',short:'Numbers & formulas',
 intro:'Problem Set 94 reviews complex arithmetic, rational equations, formula evaluation, and rearranging formulas.',
 body:panel('i<sup>2</sup>=−1<br>i<sup>3</sup>=−i<br>i<sup>4</sup>=1')+'<p>Distribute complex products, then replace i² with −1. In formulas, substitute with parentheses and apply powers before multiplication.</p>',
 steps:[['Multiply complex numbers.','Expand all products, then combine real and imaginary terms separately.'],['Solve a square equation.','If x² is negative, use imaginary roots and include both signs.'],['Clear rational denominators.','Record excluded values before multiplying through by a common denominator.'],['Rearrange a formula.','Undo addition or subtraction first, then multiplication or division. State any nonzero-divisor condition.']],
 after:callout('Order matters','(−5i²)³ applies the outside cube to the entire quantity in parentheses.'),
 mini:{prompt:'What is i²?',options:['−1','1','i'],correct:0,explain:'The imaginary unit is defined by i²=−1.'}
},
{
 id:'geometry-review',title:'Read lines, circles, and ellipses from exact data',short:'Geometry review',
 intro:'Use slopes and labeled coordinates instead of estimating a graph by appearance.',
 body:panel('y=mx+b<br>(x−h)<sup>2</sup>+(y−k)<sup>2</sup>=r<sup>2</sup><br>'+frac('(x−h)<sup>2</sup>','a<sup>2</sup>')+'+'+frac('(y−k)<sup>2</sup>','b<sup>2</sup>')+'=1'),
 steps:[['Compare lines.','Distinct lines with the same slope are parallel. Perpendicular nonvertical slopes multiply to −1.'],['Read a circle.','Its center is (h,k), and its radius is the nonnegative square root of r².'],['Read a line graph.','Use the y-intercept and rise/run between labeled points.'],['Read an ellipse.','Its horizontal and vertical semiaxes are the square roots of the corresponding denominators.']],
 after:callout('Native graph choices','Each redrawn choice preserves the source coordinates. The labels provide exact information.'),
 mini:{prompt:'For x²+y²=7, what is the radius?',options:['√7','7','49'],correct:0,explain:'The right side is r², so r=√7.'}
},
{
 id:'shared-work',title:'Add work rates to model one completed job',short:'Work-rate review',
 intro:'Practice e and Problem Set 22 ask for an equation and a decimal time when two people work together.',
 body:'<p>If one person completes a job in '+math('a')+' hours, that person completes '+math(frac('1','a'))+' of the job each hour. In '+math('t')+' hours, the completed fraction is '+math(frac('t','a'))+'.</p>'+panel(frac('t','a')+'+'+frac('t','b')+'=1'),
 steps:[['Define the time.','Let t be the number of hours both people work together.'],['Write each completed fraction.','Divide the shared time by each person’s solo completion time.'],['Add the work.','The fractions must total one completed job.'],['Solve and express as a decimal.','Combine the rates, then divide one job by the combined rate.'],['Check.','The time should be positive and shorter than either solo time.']],
 after:callout('Do not add solo times','People working together contribute work simultaneously. Add their rates.'),
 mini:{prompt:'A person finishes one job in 6 hours. What is the hourly rate?',options:['1/6 job per hour','6 jobs per hour','6 hours plus t'],correct:0,explain:'One job divided by 6 hours is 1/6 job per hour.'}
}
];

function buildQuestions(){
 const q=[];
 // Practice 94: original lettering and printed choice order.
 q.push(Q('p94-a','practice','a','Factoring by grouping','choice','Select the factored form of '+math('cdx+rx−cdy−ry')+'.',{
  page:462,choices:makeChoices(['(x+y)(cd−r)','(x+d)(yc−r)','(x−y)(cd+r)','(x−r)(yd−c)','(x+c)(yd−r)']),correct:2,
  answerHTML:'(x−y)(cd+r)',answerText:'(x-y)(cd+r)',lesson:'algebra-review',
  guide:['Group the cd terms and the r terms.','Factor the common binomial.'],
  hints:['cdx−cdy=cd(x−y).','rx−ry=r(x−y).','Both groups contain x−y.'],
  solution:[math('cdx+rx−cdy−ry=cd(x−y)+r(x−y)')+'.',math('cd(x−y)+r(x−y)=(x−y)(cd+r)')+'.'],check:'Expanding choice C reproduces all four original terms.'
 }));
 q.push(Q('p94-b','practice','b','Adding rational expressions','choice','Select the simplified form of '+math(frac('u<sup>2</sup>','uv+v<sup>2</sup>')+'+'+frac('2u+v','u+v'))+'.',{
  page:462,choices:makeChoices([frac('1','v'),frac('u−v','v'),frac('u<sup>2</sup>+2u+v','v<sup>2</sup>+u+v+uv'),frac('u+v','v'),frac('u<sup>2</sup>+2uv+v','v<sup>2</sup>+uv')]),correct:3,
  answerHTML:frac('u+v','v'),answerText:'(u+v)/v',lesson:'algebra-review',
  guide:['Factor uv+v².','Use a common denominator.','Factor the combined numerator and cancel.'],
  hints:['uv+v²=v(u+v).','Scale the second numerator by v.','u²+v(2u+v)=(u+v)².'],
  solution:['The common denominator is '+math('v(u+v)')+'.',math(frac('u<sup>2</sup>+2uv+v<sup>2</sup>','v(u+v)')+'='+frac('(u+v)<sup>2</sup>','v(u+v)')+'='+frac('u+v','v'))+'.','Keep the restrictions '+math('v≠0')+' and '+math('u+v≠0')+'.'],check:'Choice D. The combined numerator has v² as its final term.'
 }));
 q.push(Q('p94-c','practice','c','Addition method','numeric','Solve the system of equations.'+system('4x+2y=16','−4x+7y=2'),{
  page:463,fields:[field('x','x',3),field('y','y',2)],answerHTML:'x=3, y=2',answerText:'x=3; y=2',lesson:'add-or-subtract',
  guide:['Choose the operation that eliminates x.','Solve for y, then substitute to find x.','Check both originals.'],
  hints:['4x and −4x are opposites.','Add to get 9y=18.','Use y=2 in 4x+2y=16.'],
  solution:[math('9y=18')+' gives '+math('y=2')+'.',math('4x+4=16')+' gives '+math('4x=12')+' and '+math('x=3')+'.'],check:'4(3)+2(2)=16; −4(3)+7(2)=2.'
 }));
 q.push(Q('p94-d','practice','d','Subtraction method','numeric','Solve the system of equations.'+system('3x+5y=11','x+5y=−3'),{
  page:463,fields:[field('x','x',7),field('y','y',-2)],answerHTML:'x=7, y=−2',answerText:'x=7; y=-2',lesson:'subtract',
  guide:['Subtract to eliminate the equal y terms.','Solve for x and then y.','Check both equations.'],
  hints:['Subtract the second equation from the first.','2x=11−(−3)=14.','Substitute x=7 into x+5y=−3.'],
  solution:[math('2x=14')+' gives '+math('x=7')+'.',math('7+5y=−3')+' gives '+math('5y=−10')+' and '+math('y=−2')+'.'],check:'3(7)+5(−2)=11; 7+5(−2)=−3.'
 }));
 q.push(Q('p94-e','practice','e','Shared-work application','trip','Translate into an equation, then solve: Brad can clean the pool in 2 hours, and Jimmy can clean it in 3 hours. Working together, how many hours will it take them to clean the pool? Write your answer as a decimal.',{
  page:463,define:'Let t be the number of hours they work together.',
  choices:makeChoices([frac('t','2')+'+'+frac('t','3')+'=1','2t+3t=1','t=2+3',frac('2','t')+'+'+frac('3','t')+'=1',frac('t','2')+'−'+frac('t','3')+'=1']),correct:0,
  fields:[field('time','Time',1.2,'hours')],answerHTML:frac('t','2')+'+'+frac('t','3')+'=1; t=1.2 hours',answerText:'t/2+t/3=1; t=1.2 hours',lesson:'shared-work',
  answerHelp:'Choose the equation and enter the time as a decimal. These equation choices are app-authored; the source asks you to write an equation.',
  guide:['Write each person’s completed fraction in t hours.','Set the sum equal to one pool.','Solve for t and write a decimal.'],
  hints:['Brad completes t/2 of the pool.','Jimmy completes t/3.','Multiply the equation by 6: 3t+2t=6.'],
  solution:[math(frac('t','2')+'+'+frac('t','3')+'=1')+'.',math('3t+2t=6')+' gives '+math('5t=6')+'.',math('t='+frac('6','5')+'=1.2')+' hours.'],check:'1.2/2+1.2/3=0.6+0.4=1 pool.'
 }));
 // Problem Set 94: the parenthesized a–e marks refer back to Practice.
 q.push(Q('ps94-1','problem','1','Definition of a system','choice','Tell whether this statement is True or False: A group of equations that represent a single problem is called a “system” of equations.',{
  page:463,choices:makeChoices(['True','False']),correct:0,answerHTML:'True',answerText:'True',lesson:'system-model',
  guide:['Compare the statement with the definition of a system.'],hints:['A system groups related equations.','The equations describe the same problem.'],
  solution:['The statement matches the definition: related equations describing a single problem form a system.'],check:'True is choice A.'
 }));
 q.push(Q('ps94-2','problem','2','Meaning of a system solution','choice','Tell whether this statement is True or False: The solution to a system of two equations is the pair of numbers that solves both equations.',{
  page:463,choices:makeChoices(['True','False']),correct:0,answerHTML:'True',answerText:'True',lesson:'system-model',
  guide:['Ask whether the same values must satisfy both equations.'],hints:['One equation alone is insufficient.','A solution works in every equation of the system.'],
  solution:['A solution pair must satisfy both equations at the same time, so this statement is true.'],check:'True is choice A.'
 }));
 q.push(Q('ps94-3','problem','3','Complex multiplication','choice','Calculate and select the fully simplified value of '+math('(2+8i)(−3+4i)')+'.',{
  page:463,choices:makeChoices(['−38+(−16i)','26+(−16i)','−6+32i','−54','−1+12i']),correct:0,
  answerHTML:'−38−16i',answerText:'-38-16i',lesson:'complex-formulas',
  guide:['Distribute all four products.','Replace i² with −1.','Combine real and imaginary terms.'],
  hints:['The four products are −6, 8i, −24i, and 32i².','32i²=−32.','Combine −6−32 and 8i−24i separately.'],
  solution:[math('−6+8i−24i+32i<sup>2</sup>')+'.',math('−6−32+(8−24)i=−38−16i')+'.'],check:'Choice A.'
 }));
 q.push(Q('ps94-4','problem','4','Powers of the imaginary unit','choice','Calculate and select the fully simplified value of '+math('(−5i<sup>2</sup>)<sup>3</sup>')+'.',{
  page:463,choices:makeChoices(['−25i','125','−125','125i','−125i']),correct:1,
  answerHTML:'125',answerText:'125',lesson:'complex-formulas',
  guide:['Simplify i² inside the parentheses.','Then cube the entire result.'],
  hints:['i²=−1.','−5(−1)=5.','5³=125.'],solution:[math('(−5i<sup>2</sup>)<sup>3</sup>=(−5(−1))<sup>3</sup>=5<sup>3</sup>=125')+'.'],check:'Choice B. The result is real.'
 }));
 q.push(Q('ps94-5','problem','5','Parallel or perpendicular lines','choice','Tell whether the lines for '+math('y+5x=1')+' and '+math('y=−5x+3')+' are parallel or perpendicular.',{
  page:463,choices:makeChoices(['Parallel','Perpendicular']),correct:0,answerHTML:'Parallel',answerText:'Parallel',lesson:'geometry-review',
  guide:['Put both equations into slope-intercept form.','Compare slopes and intercepts.'],
  hints:['The first equation becomes y=−5x+1.','Both slopes are −5; the intercepts differ.'],
  solution:['The lines are '+math('y=−5x+1')+' and '+math('y=−5x+3')+'.','Equal slopes and different intercepts give distinct parallel lines.'],check:'Choice A. The slope product is 25, not −1.'
 }));
 q.push(Q('ps94-6','problem','6','Circle center and radius','numeric','Tell the center and radius of the circle for '+math('x<sup>2</sup>+y<sup>2</sup>=7')+'.',{
  page:463,fields:[field('cx','Center x',0),field('cy','Center y',0),{...field('radius','Radius',Math.sqrt(7)),placeholder:'sqrt(7) or decimal',tolerance:0.005}],
  answerHTML:'Center (0,0); radius '+root('7'),answerText:'center (0,0); radius sqrt(7)',lesson:'geometry-review',
  guide:['Compare with (x−h)²+(y−k)²=r².','Read the center and take the positive square root for the radius.'],
  hints:['There are no horizontal or vertical shifts.','r²=7, so r=√7.'],solution:['The equation is '+math('(x−0)<sup>2</sup>+(y−0)<sup>2</sup>=7')+'.','The center is '+math('(0,0)')+' and the radius is '+math(root('7'))+'.'],check:'The radius squared is 7.',answerHelp:'Enter the center coordinates and radius. Use sqrt(7), or round the radius to the nearest hundredth.'
 }));
 q.push(Q('ps94-7','problem','7','Perfect-square factoring','choice','Select the factored form of '+math('y<sup>2</sup>−2by+b<sup>2</sup>')+'.',{
  page:463,choices:makeChoices(['(y+b)(y−2b)','(y−b)(y+2b)','(y+b)<sup>2</sup>','(y−b)<sup>2</sup>','(y+b)(y−b)']),correct:3,
  answerHTML:'(y−b)<sup>2</sup>',answerText:'(y-b)^2',lesson:'algebra-review',
  guide:['Identify the two squared terms.','Use the middle term to choose the sign.'],hints:['The square roots are y and b.','The middle term is −2yb.'],
  solution:[math('y<sup>2</sup>−2yb+b<sup>2</sup>=(y−b)<sup>2</sup>')+'.'],check:'Expanding choice D gives y²−2by+b².'
 }));
 q.push(Q('ps94-8','problem','8','Factoring by grouping','choice','Select the factored form of '+math('abx+px−aby−py')+'.',{
  page:463,sourcePracticeReference:'a',choices:makeChoices(['(x+a)(yb−p)','(x+b)(ya−p)','(x+y)(ab−p)','(x−y)(ab+p)','(x−p)(yb−a)']),correct:3,
  answerHTML:'(x−y)(ab+p)',answerText:'(x-y)(ab+p)',lesson:'algebra-review',
  guide:['Group the ab terms and p terms.','Factor the common binomial.'],hints:['abx−aby=ab(x−y).','px−py=p(x−y).'],
  solution:[math('ab(x−y)+p(x−y)=(x−y)(ab+p)')+'.'],check:'Choice D expands to the source expression.'
 }));
 q.push(Q('ps94-9','problem','9','Difference-of-squares factoring','choice','Select the factored form of '+math('j<sup>2</sup>x<sup>2</sup>−k<sup>2</sup>y<sup>2</sup>')+'.',{
  page:463,choices:makeChoices(['(jx−ky)<sup>2</sup>','(jk+xy)(jk−xy)','(jx+ky)<sup>2</sup>','(j<sup>2</sup>x<sup>2</sup>−k<sup>2</sup>y<sup>2</sup>)<sup>2</sup>','(jx+ky)(jx−ky)']),correct:4,
  answerHTML:'(jx+ky)(jx−ky)',answerText:'(jx+ky)(jx-ky)',lesson:'algebra-review',
  guide:['Write each term as a square.','Apply the difference-of-squares identity.'],hints:['j²x²=(jx)².','k²y²=(ky)².'],
  solution:[math('(jx)<sup>2</sup>−(ky)<sup>2</sup>=(jx+ky)(jx−ky)')+'.'],check:'Choice E; the cross terms cancel.'
 }));
 q.push(Q('ps94-10','problem','10','Multiplying monomials','choice','Select the simplified form of '+math('(13x<sup>4</sup>y<sup>3</sup>z<sup>2</sup>)(2xy<sup>2</sup>z<sup>3</sup>)')+'.',{
  page:463,choices:makeChoices(['15x<sup>4</sup>y<sup>6</sup>z<sup>6</sup>','26x<sup>4</sup>y<sup>5</sup>z<sup>5</sup>','15x<sup>5</sup>y<sup>5</sup>z<sup>5</sup>','26x<sup>4</sup>y<sup>6</sup>z<sup>6</sup>','26x<sup>5</sup>y<sup>5</sup>z<sup>5</sup>']),correct:4,
  answerHTML:'26x<sup>5</sup>y<sup>5</sup>z<sup>5</sup>',answerText:'26x^5y^5z^5',lesson:'algebra-review',
  guide:['Multiply coefficients.','Add exponents for each variable.'],hints:['13·2=26.','The x exponents are 4 and 1.','The y and z exponents each total 5.'],
  solution:[math('13·2·x<sup>4+1</sup>y<sup>3+2</sup>z<sup>2+3</sup>=26x<sup>5</sup>y<sup>5</sup>z<sup>5</sup>')+'.'],check:'Choice E.'
 }));
 q.push(Q('ps94-11','problem','11','Squaring a binomial','choice','Select the simplified form of '+math('(u+t)(u+t)')+'.',{
  page:463,choices:makeChoices(['u<sup>2</sup>+2ut+t<sup>2</sup>','2u+2t','u<sup>2</sup>+2u<sup>2</sup>t<sup>2</sup>+t<sup>2</sup>','u<sup>2</sup>−t<sup>2</sup>','u<sup>2</sup>+t<sup>2</sup>']),correct:0,
  answerHTML:'u<sup>2</sup>+2ut+t<sup>2</sup>',answerText:'u^2+2ut+t^2',lesson:'algebra-review',
  guide:['Expand all four products.','Combine the two cross terms.'],hints:['u·t and t·u are equal.','ut+ut=2ut.'],
  solution:[math('u<sup>2</sup>+ut+tu+t<sup>2</sup>=u<sup>2</sup>+2ut+t<sup>2</sup>')+'.'],check:'Choice A retains the middle term.'
 }));
 q.push(Q('ps94-12','problem','12','Dividing rational expressions','choice','Select the simplified form of '+math(frac('ax','x<sup>2</sup>−y<sup>2</sup>')+'÷'+frac('bx','x<sup>2</sup>+2xy+y<sup>2</sup>'))+'.',{
  page:463,choices:makeChoices([frac('b','a'),frac('ax+ay','bx−by'),frac('ax−ay','bx+by'),frac('a','b'),frac('bx−by','ax+ay')]),correct:1,
  answerHTML:frac('ax+ay','bx−by'),answerText:'(ax+ay)/(bx-by)',lesson:'algebra-review',
  guide:['Factor both denominators.','Multiply by the reciprocal.','Cancel common factors and match the choice.'],
  hints:['x²−y²=(x−y)(x+y).','x²+2xy+y²=(x+y)².','The result is a(x+y)/(b(x−y)).'],
  solution:[math(frac('ax','(x−y)(x+y)')+'·'+frac('(x+y)<sup>2</sup>','bx'))+'.','Cancel x and one x+y factor to get '+math(frac('a(x+y)','b(x−y)')+'='+frac('ax+ay','bx−by'))+'.','Original restrictions: '+math('x−y≠0, x+y≠0, b≠0, x≠0')+'.'],check:'Choice B.'
 }));
 q.push(Q('ps94-13','problem','13','Adding rational expressions','choice','Select the simplified form of '+math(frac('x<sup>2</sup>','xy+y<sup>2</sup>')+'+'+frac('2x+y','x+y'))+'.',{
  page:464,sourcePracticeReference:'b',choices:makeChoices([frac('x<sup>2</sup>+2x+y','y<sup>2</sup>+x+y+xy'),frac('x<sup>2</sup>+2xy+y','y<sup>2</sup>+xy'),frac('x+y','y'),frac('1','y'),frac('x−y','y')]),correct:2,
  answerHTML:frac('x+y','y'),answerText:'(x+y)/y',lesson:'algebra-review',
  guide:['Factor the first denominator.','Use the common denominator y(x+y).','Factor the combined numerator.'],
  hints:['xy+y²=y(x+y).','The numerator is x²+y(2x+y).','x²+2xy+y²=(x+y)².'],
  solution:[math(frac('x<sup>2</sup>+2xy+y<sup>2</sup>','y(x+y)')+'='+frac('(x+y)<sup>2</sup>','y(x+y)')+'='+frac('x+y','y'))+'.','Keep '+math('y≠0')+' and '+math('x+y≠0')+'.'],check:'Choice C. The numerator before cancellation ends in y².'
 }));
 q.push(Q('ps94-14','problem','14','Rational equation','numeric','Solve '+math(frac('2x+5','8x−16')+'='+frac('2','x−2'))+'.',{
  page:464,fields:[field('x','x',5.5)],answerHTML:'x='+frac('11','2')+'=5.5',answerText:'x=11/2',lesson:'complex-formulas',
  guide:['Identify excluded values.','Multiply by the common denominator.','Solve and substitute into the original.'],
  hints:['8x−16=8(x−2), so x≠2.','Multiplying by 8(x−2) gives 2x+5=16.','2x=11.'],
  solution:['For '+math('x≠2')+', clear denominators to get '+math('2x+5=16')+'.',math('2x=11')+' gives '+math('x='+frac('11','2')+'=5.5')+'.'],check:'At x=5.5, the left side is 16/28=4/7 and the right side is 2/3.5=4/7.'
 }));
 q.push(Q('ps94-15','problem','15','Imaginary solutions','choice','Solve '+math('7x<sup>2</sup>+28=0')+' and select the choice containing all solutions.',{
  page:464,choices:makeChoices([root('21')+'i, −'+root('21')+'i',root('21')+', −'+root('21'),'2i, −2i',root('2')+'i, −'+root('2')+'i','2, −2']),correct:2,
  answerHTML:'x=2i or x=−2i',answerText:'x=2i,-2i',lesson:'complex-formulas',
  guide:['Isolate x².','Take both square roots using i²=−1.'],hints:['7x²=−28.','x²=−4.','The two roots are ±2i.'],
  solution:[math('x<sup>2</sup>=−4')+'.','Because '+math('(2i)<sup>2</sup>=−4')+' and '+math('(−2i)<sup>2</sup>=−4')+', both '+math('2i')+' and '+math('−2i')+' are solutions.'],check:'Choice C. Each root gives 7(−4)+28=0.'
 }));
 q.push(Q('ps94-16','problem','16','Formula evaluation','numeric','In '+math('z=2x<sup>2</sup>y<sup>3</sup>')+', find z when '+math('x='+frac('1','4'))+' and '+math('y=2')+'.',{
  page:464,fields:[field('z','z',1)],answerHTML:'z=1',answerText:'z=1',lesson:'complex-formulas',
  guide:['Substitute using parentheses.','Evaluate powers first.','Multiply and simplify.'],hints:['(1/4)²=1/16.','2³=8.','2·(1/16)·8=1.'],
  solution:[math('z=2('+frac('1','4')+')<sup>2</sup>(2)<sup>3</sup>=2·'+frac('1','16')+'·8=1')+'.'],check:'The powers apply to x and y before multiplication by 2.'
 }));
 q.push(Q('ps94-17','problem','17','Rearranging a formula','choice','Which choice represents '+math('sd−ef=g')+' after it has been solved for d?',{
  page:464,choices:makeChoices(['d='+frac('g−ef','s'),'d='+frac('s','g+ef'),'d='+frac('gef','s'),'d=sg−sef','d='+frac('g+ef','s')]),correct:4,
  answerHTML:'d='+frac('g+ef','s'),answerText:'d=(g+ef)/s',lesson:'complex-formulas',
  guide:['Add ef to both sides.','Divide both sides by s.'],hints:['sd=g+ef.','For s≠0, divide the entire right side by s.'],
  solution:[math('sd−ef=g')+' becomes '+math('sd=g+ef')+'.','For '+math('s≠0')+', '+math('d='+frac('g+ef','s'))+'.'],check:'Choice E. Substitution gives (g+ef)−ef=g.'
 }));
 q.push(Q('ps94-18','problem','18','Selecting a line graph','choice','Select the graph of '+math('y=3x−5')+'. Use the labeled coordinates in the native graph choices below.',{
  page:464,asset:'ps18',choices:makeChoices(['Graph A','Graph B','Graph C','Graph D','Graph E']),correct:4,
  answerHTML:'Graph E',answerText:'E',lesson:'geometry-review',
  guide:['Find the y-intercept.','Evaluate the equation at a labeled x value.','Compare both coordinates with each graph.'],
  hints:['At x=0, y=−5.','At x=1, y=−2.','The required slope is (−2−(−5))/(1−0)=3.'],
  solution:['The graph must pass through '+math('(0,−5)')+' and '+math('(1,−2)')+'.','Choice E has exactly those labeled points. A has slope 4, B slope 2, C slope −3, and D has intercept +5.'],check:'Both E points satisfy y=3x−5.'
 }));
 q.push(Q('ps94-19','problem','19','Selecting an ellipse graph','choice','Select the graph of '+math(frac('x<sup>2</sup>','25')+'+'+frac('y<sup>2</sup>','16')+'=1')+'. Use the source-labeled coordinates in the native graph choices below.',{
  ...finalSource,asset:'ps19',choices:makeChoices(['Graph A','Graph B','Graph C','Graph D','Graph E']),correct:0,
  answerHTML:'Graph A',answerText:'A',lesson:'geometry-review',
  guide:['Identify the center.','Take the square roots of the two denominators.','Match the four axis endpoints.'],
  hints:['The center is (0,0).','The horizontal semiaxis is √25=5.','The vertical semiaxis is √16=4.'],
  solution:['The ellipse has center '+math('(0,0)')+', horizontal endpoints '+math('(−5,0), (5,0)')+', and vertical endpoints '+math('(0,−4), (0,4)')+'.','Choice A matches all five labeled coordinates.'],check:'25/25=1 at (±5,0), and 16/16=1 at (0,±4).'
 }));
 q.push(Q('ps94-20','problem','20','Addition method','numeric','Solve the system of equations.'+system('2x+3y=23','−2x+5y=17'),{
  ...finalSource,sourcePracticeReference:'c',fields:[field('x','x',4),field('y','y',5)],answerHTML:'x=4, y=5',answerText:'x=4; y=5',lesson:'add-or-subtract',
  guide:['Add the equations to eliminate x.','Solve for y and recover x.','Check both originals.'],hints:['2x and −2x cancel.','8y=40.','2x+3(5)=23.'],
  solution:[math('8y=40')+' gives '+math('y=5')+'.',math('2x+15=23')+' gives '+math('2x=8')+' and '+math('x=4')+'.'],check:'2(4)+3(5)=23; −2(4)+5(5)=17.'
 }));
 q.push(Q('ps94-21','problem','21','Subtraction method','numeric','Solve the system of equations.'+system('2x+4y=0','x+4y=−6'),{
  ...finalSource,sourcePracticeReference:'d',fields:[field('x','x',6),field('y','y',-3)],answerHTML:'x=6, y=−3',answerText:'x=6; y=-3',lesson:'subtract',
  guide:['Subtract the second equation from the first.','Substitute x to find y.','Check both originals.'],hints:['The 4y terms cancel.','x=0−(−6)=6.','6+4y=−6.'],
  solution:['Subtracting gives '+math('x=6')+'.',math('6+4y=−6')+' gives '+math('4y=−12')+' and '+math('y=−3')+'.'],check:'2(6)+4(−3)=0; 6+4(−3)=−6.'
 }));
 q.push(Q('ps94-22','problem','22','Shared-work application','trip','Translate into an equation, then solve: Lisa can paint the bedroom in 6 hours, and Vicky can paint it in 9 hours. Working together, how many hours will it take them to paint the bedroom? Write your answer as a decimal.',{
  ...finalSource,sourcePracticeReference:'e',define:'Let t be the number of hours they work together.',
  choices:makeChoices(['6t+9t=1',frac('t','6')+'−'+frac('t','9')+'=1',frac('t','6')+'+'+frac('t','9')+'=1','t=6+9',frac('6','t')+'+'+frac('9','t')+'=1']),correct:2,
  fields:[field('time','Time',3.6,'hours')],answerHTML:frac('t','6')+'+'+frac('t','9')+'=1; t=3.6 hours',answerText:'t/6+t/9=1; t=3.6 hours',lesson:'shared-work',
  answerHelp:'Choose the equation and enter the time as a decimal. These equation choices are app-authored; the source asks you to write an equation.',
  guide:['Write each completed fraction in t hours.','Set the total equal to one bedroom.','Solve and give a decimal time.'],
  hints:['Lisa completes t/6 of the job.','Vicky completes t/9.','Multiply by 18 to obtain 3t+2t=18.'],
  solution:[math(frac('t','6')+'+'+frac('t','9')+'=1')+'.',math('3t+2t=18')+' gives '+math('5t=18')+'.',math('t='+frac('18','5')+'=3.6')+' hours.'],check:'3.6/6+3.6/9=0.6+0.4=1 bedroom.'
 }));
 return q;
}

// Geometry uses only source labels, with the A–E ordering unchanged.
const graphSets={
 ps18:[
  {label:'A',kind:'line',m:4,b:-5,points:[[0,-5,'(0,−5)'],[1,-1,'(1,−1)']]},
  {label:'B',kind:'line',m:2,b:-5,points:[[0,-5,'(0,−5)'],[1,-3,'(1,−3)']]},
  {label:'C',kind:'line',m:-3,b:-5,points:[[-1,-2,'(−1,−2)'],[0,-5,'(0,−5)']]},
  {label:'D',kind:'line',m:3,b:5,points:[[-1,2,'(−1,2)'],[0,5,'(0,5)']]},
  {label:'E',kind:'line',m:3,b:-5,points:[[1,-2,'(1,−2)'],[0,-5,'(0,−5)']]}
 ],
 ps19:[
  {label:'A',kind:'ellipse',h:0,k:0,a:5,b:4,points:[[-5,0,'(−5,0)'],[5,0,'(5,0)'],[0,4,'(0,4)'],[0,-4,'(0,−4)'],[0,0,'(0,0)']]},
  {label:'B',kind:'ellipse',h:0,k:0,a:4,b:5,points:[[-4,0,'(−4,0)'],[4,0,'(4,0)'],[0,5,'(0,5)'],[0,-5,'(0,−5)'],[0,0,'(0,0)']]},
  {label:'C',kind:'ellipse',h:0,k:0,a:Math.sqrt(5),b:2,points:[[-Math.sqrt(5),0,'(−√5,0)'],[Math.sqrt(5),0,'(√5,0)'],[0,2,'(0,2)'],[0,-2,'(0,−2)'],[0,0,'(0,0)']]},
  {label:'D',kind:'ellipse',h:Math.sqrt(5),k:2,a:Math.sqrt(5),b:2,points:[[0,2,'(0,2)'],[2*Math.sqrt(5),2,'(2√5,2)'],[Math.sqrt(5),4,'(√5,4)'],[Math.sqrt(5),0,'(√5,0)'],[Math.sqrt(5),2,'(√5,2)']]},
  {label:'E',kind:'ellipse',h:Math.sqrt(5),k:0,a:Math.sqrt(5),b:2,points:[[0,0,'(0,0)'],[2*Math.sqrt(5),0,'(2√5,0)'],[Math.sqrt(5),2,'(√5,2)'],[Math.sqrt(5),-2,'(√5,−2)'],[Math.sqrt(5),0,'(√5,0)']]}
 ]
};

function graphCard(set,g){
 const W=360,H=410,unit=20,X=x=>180+unit*x,Y=y=>180-unit*y;
 const uid='l94-'+set+'-'+g.label;
 const description=g.kind==='line'
  ?'Line through '+g.points.map(p=>p[2]).join(' and ')+'.'
  :'Ellipse with center '+g.points[4][2]+' and boundary points '+g.points.slice(0,4).map(p=>p[2]).join(', ')+'.';
 let grid='';
 for(let n=-7;n<=7;n++){
  grid+=`<line x1="${X(n)}" y1="40" x2="${X(n)}" y2="320"/><line x1="40" y1="${Y(n)}" x2="320" y2="${Y(n)}"/>`;
 }
 let shape='';
 if(g.kind==='line'){
  // Intersect the line with the square viewport; every endpoint lies on it.
  const ends=[[-7,g.m*(-7)+g.b],[7,g.m*7+g.b],[(-7-g.b)/g.m,-7],[(7-g.b)/g.m,7]]
   .filter(([x,y])=>x>=-7&&x<=7&&y>=-7&&y<=7)
   .filter((p,i,a)=>a.findIndex(t=>Math.abs(t[0]-p[0])<1e-9&&Math.abs(t[1]-p[1])<1e-9)===i);
  shape=`<line x1="${X(ends[0][0])}" y1="${Y(ends[0][1])}" x2="${X(ends[1][0])}" y2="${Y(ends[1][1])}" stroke="#17685f" stroke-width="3" marker-start="url(#${uid}-line)" marker-end="url(#${uid}-line)"/>`;
 }else{
  shape=`<ellipse cx="${X(g.h)}" cy="${Y(g.k)}" rx="${g.a*unit}" ry="${g.b*unit}" fill="none" stroke="#17685f" stroke-width="3"/>`;
 }
 const pointDots=g.points.map(([x,y])=>`<circle cx="${X(x)}" cy="${Y(y)}" r="4" fill="#17685f"/>`).join('');
 const pointLabels=g.points.map(([x,y,label],i)=>{
  let dx=10,dy=-12,anchor='start';
  if(g.kind==='ellipse'){
   if(i===0){dx=-10;dy=20;anchor='end';}
   if(i===1){dx=10;dy=20;}
   if(i===2){dx=0;dy=-12;anchor='middle';}
   if(i===3){dx=0;dy=22;anchor='middle';}
   if(i===4){dx=12;dy=-12;}
  }else if(x<=0){dx=-10;dy=22;anchor='end';}
  return `<text x="${X(x)+dx}" y="${Y(y)+dy}" text-anchor="${anchor}">${esc(label)}</text>`;
 }).join('');
 return `<div style="border:1px solid #cbded3;border-radius:12px;background:#fffef9;padding:8px;min-width:0"><svg viewBox="0 0 ${W} ${H}" style="display:block;width:100%;height:auto" role="img" aria-labelledby="${uid}-title ${uid}-desc">
 <title id="${uid}-title">Graph ${g.label}</title><desc id="${uid}-desc">${esc(description)}</desc>
 <defs><marker id="${uid}-axis" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse"><path d="M1,1 L6,3.5 L1,6" fill="none" stroke="#263b40" stroke-width="1.4"/></marker><marker id="${uid}-line" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto-start-reverse"><path d="M1,1 L6,3.5 L1,6" fill="none" stroke="#17685f" stroke-width="1.4"/></marker></defs>
 <text x="12" y="23" fill="#182c35" font-size="20" font-family="system-ui,sans-serif" font-weight="700">${g.label}</text>
 <g stroke="#ecece4" stroke-width="1">${grid}</g>
 <g stroke="#263b40" stroke-width="1.6"><line x1="35" y1="180" x2="325" y2="180" marker-start="url(#${uid}-axis)" marker-end="url(#${uid}-axis)"/><line x1="180" y1="325" x2="180" y2="35" marker-start="url(#${uid}-axis)" marker-end="url(#${uid}-axis)"/></g>
 <g fill="#263b40" font-size="16" font-family="system-ui,sans-serif"><text x="332" y="185">x</text><text x="190" y="35">y</text></g>
 ${shape}${pointDots}<g font-family="system-ui,sans-serif" font-size="14" fill="#182c35" style="paint-order:stroke;stroke:#fffef9;stroke-width:4px;stroke-linejoin:round">${pointLabels}</g>
 <text x="180" y="366" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" fill="#62736e">${g.kind==='line'?'Use the two labeled points.':'Use the labeled center and boundary points.'}</text></svg></div>`;
}

function renderQuestionAsset(q){
 const set=graphSets[q.asset];
 return set?`<figure class="graph-frame" style="max-width:none"><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;padding:10px">${set.map(g=>graphCard(q.asset,g)).join('')}</div><figcaption>Graph choices A–E, redrawn from the exact source labels.</figcaption></figure>`:'';
}

function referenceHtml(){return `<p>Lesson 94 methods and review formulas.</p><div class="reference-grid">
 <div class="reference-item"><h4>System solution</h4><p>The same values must satisfy every equation in the system.</p></div>
 <div class="reference-item"><h4>Elimination</h4><p>Subtract equal variable terms. Add opposite variable terms. Apply the operation to both sides.</p></div>
 <div class="reference-item"><h4>Finish and check</h4><p>Substitute the first value into an original equation. Check the resulting pair in both originals.</p></div>
 <div class="reference-item"><h4>Factoring</h4>${math('A<sup>2</sup>−B<sup>2</sup>=(A+B)(A−B)')}<br>${math('(A−B)<sup>2</sup>=A<sup>2</sup>−2AB+B<sup>2</sup>')}</div>
 <div class="reference-item"><h4>Rational expressions</h4><p>Factor first. Add using a common denominator; divide by multiplying by the reciprocal. Keep original restrictions.</p></div>
 <div class="reference-item"><h4>Imaginary unit</h4>${math('i<sup>2</sup>=−1')}<p>Distribute complex products and combine real and imaginary terms.</p></div>
 <div class="reference-item"><h4>Lines</h4>${math('y=mx+b')}<p>m is slope; b is the y-intercept. Distinct equal-slope lines are parallel.</p></div>
 <div class="reference-item"><h4>Circle</h4>${math('(x−h)<sup>2</sup>+(y−k)<sup>2</sup>=r<sup>2</sup>')}<p>Center (h,k); radius r≥0.</p></div>
 <div class="reference-item"><h4>Ellipse</h4>${math(frac('(x−h)<sup>2</sup>','a<sup>2</sup>')+'+'+frac('(y−k)<sup>2</sup>','b<sup>2</sup>')+'=1')}<p>Horizontal semiaxis a; vertical semiaxis b.</p></div>
 <div class="reference-item"><h4>Shared work</h4>${math(frac('t','a')+'+'+frac('t','b')+'=1')}<p>a and b are solo times; t is the shared completion time.</p></div>
 </div>`;}

const packageDef={
 id:'lesson-094',number:94,chapter:'Chapter 13',title:'Linear Systems',
 contentVersion:'course-package-1.0',sourceRevision:'lesson94-2026-10-12-photos',
 heroTitle:'Two equations.<br><em>One solution pair.</em>',
 description:'Model two unknowns with a linear system, eliminate by addition or subtraction, and check both equations. Complete Practice 94 and Problem Set 94 with shared-engine scoring and progress.',
 heroArt:`<div class="art-caption"><span>Linear systems</span><span>Add or subtract</span></div><div class="formula">7x+2y=29<br>3x−2y=1</div><div class="connector">↓ add to eliminate y</div><div class="formula">10x=30<br>x=3, y=4</div><p class="art-foot">A solution pair satisfies both original equations.</p>`,
 topics,
 sections:[
  {id:'practice',label:'Practice 94',intro:'Five exercises on factoring, rational expressions, two linear systems, and a shared-work application.'},
  {id:'problem',label:'Problem Set 94',intro:'Twenty-two exercises on system definitions, complex arithmetic, geometry, factoring, rational expressions, equations, formulas, graph selection, linear systems, and shared work.'}
 ],
 buildQuestions,referenceHtml,renderQuestionAsset,
 sourceStatus:{
  status:'PARTIALLY_SOURCE_VERIFIED',
  pages:'460–464 plus Lesson 94 continuation (IMG_4387.jpeg; page-number footer cropped)',
  verified:'2026-10-12 CT: all supplied instructional and exercise mathematics resolved; final printed page number unresolved',
  uncertainItems:['IMG_4387.jpeg: printed page number is outside the photograph; no numeric page assigned to Problem Set 19–22.']
 }
};
global.Algebra2CourseRegistry.register(packageDef);
})(window);
