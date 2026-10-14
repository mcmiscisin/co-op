(function(global){
'use strict';
const E=global.Algebra2Engine;
if(!E) throw Error('Algebra2Engine must load before Lesson 95.');
const {math,frac,root,panel,callout,makeChoices}=E.helpers;
const Q=(id,section,label,skill,type,prompt,rest)=>({id,section,label,skill,type,prompt,...rest});
const system=(a,b)=>panel(a+'<br>'+b);
const field=(key,label,value,suffix='')=>({key,label,value,tolerance:1e-9,placeholder:'number',...(suffix?{suffix}:{})});
const unseenPage={sourcePhoto:'IMG_4399.jpeg',sourceLocation:'Lesson 95 instructional/Practice a–b sheet; printed page-number footer cropped'};
const fourthRoot=s=>`<span aria-label="fourth root of ${s}"><sup style="font-size:.6em;position:relative;top:-.3em">4</sup>${root(s)}</span>`;

const topics=[
{
 id:'elimination-setup',title:'Rewrite first when terms do not cancel',short:'Plan elimination',
 intro:'Addition eliminates opposite terms; subtraction eliminates equal terms. Inspect the coefficients before choosing an operation.',
 body:system('4x−5y=6','2x+y=10')+'<p>The x coefficients are 4 and 2. The y coefficients are −5 and 1. Neither pair is already equal or opposite, so rewrite an equation before eliminating.</p>',
 steps:[['Choose a variable to eliminate.','The x coefficients are convenient because 4 is twice 2.'],['Choose a nonzero multiplier.','Multiply the second equation by 2 to make its x coefficient 4.'],['Scale the entire equation.','Multiply every term on the left and the number on the right by the same factor.']],
 after:callout('Equivalent equations','Multiplying both sides by the same nonzero number preserves the solutions. Multiplying only selected terms changes the equation.'),
 mini:{prompt:'What happens when the whole equation 2x+y=10 is multiplied by 2?',options:['4x+2y=20','4x+y=20','4x+2y=10'],correct:0,explain:'The multiplier applies to 2x, y, and 10.'}
},
{
 id:'rewrite-one',title:'Rewrite one equation, then subtract',short:'Scale one equation',
 intro:'After matching one pair of coefficients, eliminate that variable and solve the remaining one.',
 body:system('4x−5y=6','4x+2y=20'),
 steps:[['Subtract the second equation from the first.',math('(4x−5y)−(4x+2y)=6−20')+'.'],['Apply every subtraction sign.',math('4x−5y−4x−2y=−14')+', so '+math('−7y=−14')+'.'],['Solve for y.',math('y=2')+'.'],['Substitute into an original equation.',math('2x+2=10')+' gives '+math('x=4')+'.'],['Check both originals.',math('4(4)−5(2)=6')+' and '+math('2(4)+2=10')+'.']],
 after:callout('Return to an original equation','Use the known value to find the second variable, then check the pair in both original equations.'),
 mini:{prompt:'When subtracting 4x+2y from 4x−5y, what y term remains?',options:['−7y','−3y','7y'],correct:0,explain:'−5y−2y=−7y.'}
},
{
 id:'choose-lcm',title:'Use a common multiple to choose integer multipliers',short:'Choose multipliers',
 intro:'A least common multiple gives a convenient target when both equations are scaled using whole-number factors.',
 body:system('5x+3y=−19','9x−2y=25')+'<p>To eliminate y, use the magnitudes 3 and 2. Their least common multiple is 6. The target terms are +6y and −6y.</p>',
 steps:[['Choose y for elimination.','The y terms have opposite signs, so addition will work after their magnitudes match.'],['Find the least common multiple.',math('LCM(3,2)=6')+'.'],['Determine the multipliers.','Multiply the first whole equation by 2 and the second whole equation by 3.'],['Keep both sides balanced.',math('2(5x+3y)=2(−19)')+' and '+math('3(9x−2y)=3(25)')+'.']],
 after:callout('Whole-number strategy','Scaling both equations avoids fractions here. A suitable fractional multiplier on only one equation is also valid; for example, scaling the first by 2/3 creates +2y, which cancels the second equation’s −2y when added.'),
 mini:{prompt:'For y coefficients 3 and −2, what is the least positive common magnitude?',options:['6','5','1'],correct:0,explain:'6 is divisible by both 3 and 2.'}
},
{
 id:'rewrite-both',title:'Rewrite both equations, add, and finish',short:'Scale both equations',
 intro:'Once the terms are opposites, add corresponding sides to eliminate the chosen variable.',
 body:system('10x+6y=−38','27x−6y=75'),
 steps:[['Add the equations.',math('10x+6y+27x−6y=−38+75')+'.'],['Combine like terms.',math('37x=37')+' gives '+math('x=1')+'.'],['Recover y from an original equation.',math('5(1)+3y=−19')+' gives '+math('3y=−24')+' and '+math('y=−8')+'.'],['Check both originals.',math('5(1)+3(−8)=−19')+' and '+math('9(1)−2(−8)=25')+'.']],
 after:callout('Match the operation to the signs','Use addition for opposite terms and subtraction for equal terms. Multiply all terms and both sides before combining equations.'),
 mini:{prompt:'What happens to +6y and −6y when the equations are added?',options:['They cancel','They give 12y','They give −12y'],correct:0,explain:'6y+(−6y)=0.'}
},
{
 id:'rational-polynomial',title:'Factor before rational and polynomial operations',short:'Algebra review',
 intro:'The exercise review includes common factors, square patterns, rational expressions, multiplication, and polynomial division.',
 body:panel('A<sup>2</sup>−B<sup>2</sup>=(A+B)(A−B)<br>(A+B)<sup>2</sup>=A<sup>2</sup>+2AB+B<sup>2</sup>')+'<p>When subtracting fractions, factor denominators and build a common denominator. When multiplying fractions, cancel common factors after factoring.</p>',
 steps:[['Factor common monomials.','Divide every term by the common factor.'],['Recognize square patterns.','Use the middle term to distinguish a perfect square from a difference of squares.'],['Combine rational expressions.','Scale numerators and denominators together; subtract the entire second numerator.'],['Expand or divide polynomials.','Distribute carefully and combine only like terms. Check a quotient by multiplying it by the divisor.'],['Retain restrictions.','Values making an original denominator zero remain excluded after simplification.']],
 after:callout('Exponents in sums','Adding like terms changes their coefficients, not their exponents.'),
 mini:{prompt:'What changes when 3.1m²n and 5.7m²n are added?',options:['Only the coefficient','The exponent on m','Both exponents are doubled'],correct:0,explain:'The identical variable part stays m²n.'}
},
{
 id:'formula-rearrangement',title:'Collect the requested variable before dividing',short:'Rearrange formulas',
 intro:'Some formulas contain the requested variable on both sides. Expand, collect its terms, factor, and then isolate it.',
 body:panel('hf=n(f−b)')+'<p>The variable f occurs on both sides. A formula is solved for f only when f is isolated and the other side no longer contains f.</p>',
 steps:[['Expand.',math('hf=nf−nb')+'.'],['Collect the f terms.',math('hf−nf=−nb')+'.'],['Factor f.',math('(h−n)f=−nb')+'.'],['Divide by the remaining coefficient.',math('f='+frac('−nb','h−n')+'='+frac('bn','n−h'))+', provided '+math('h≠n')+'.']],
 after:callout('Zero coefficient','If h=n, division by h−n is invalid. The original equation must be considered separately; the displayed solved formula assumes h≠n.'),
 mini:{prompt:'Which expression factors hf−nf?',options:['(h−n)f','(h+n)f','hnf'],correct:0,explain:'Both terms share the factor f.'}
},
{
 id:'equations-geometry',title:'Use exact values in arithmetic, equations, and geometry',short:'Equations & geometry',
 intro:'The review includes order of operations, distance, parabola vertices, square equations, formula evaluation, and point-slope line equations.',
 body:panel('d='+root('(Δx)<sup>2</sup>+(Δy)<sup>2</sup>')+'<br>y−y<sub>1</sub>=m(x−x<sub>1</sub>)'),
 steps:[['Evaluate expressions.','Apply parentheses and powers before multiplication, division, addition, and subtraction.'],['Find distance.','Square the coordinate differences, add, and take the nonnegative square root.'],['Read a parabola.','For y=a(x−h)²+k, the vertex is (h,k); positive a opens up and negative a opens down.'],['Solve x²=c.','For positive c, include both square roots.'],['Write a line equation.','Use the given point and slope, or compute slope from two exact points.']],
 after:callout('Signs inside point-slope form','For a point with negative coordinates, subtracting its coordinates produces plus signs.'),
 mini:{prompt:'For y=−(1/3)x², which direction does the parabola open?',options:['Down','Up','Left'],correct:0,explain:'The coefficient of x² is negative.'}
},
{
 id:'age-models',title:'Translate present and future ages into an equation',short:'Age applications',
 intro:'Let x be the younger person’s age now. Write the older age from the current multiple, then add the same elapsed years to each person.',
 body:'<p>If the older person is r times as old now and the future multiple is s after t years, the age relationship becomes</p>'+panel('rx+t=s(x+t)'),
 steps:[['Define the current younger age.','Let it be x. The current older age is rx.'],['Advance both ages by t years.','The future ages are rx+t and x+t.'],['Use the future multiple.',math('rx+t=s(x+t)')+'.'],['Expand and solve.',math('rx+t=sx+st')+'. Collect x terms and constants.'],['Check both time points.','Verify the current ratio and the future ratio using the resulting ages.']],
 after:callout('Construct and solve','In the application exercises, numeric coefficient fields record the expanded equation Ax+B=Cx+D. The left side is the older future age; the right side is the stated multiple of the younger future age.'),
 mini:{prompt:'If someone is x years old now, how old will that person be in t years?',options:['x+t','tx','x−t'],correct:0,explain:'Elapsed years are added to the current age.'}
}
];

function buildQuestions(){
 const q=[];
 q.push(Q('p95-a','practice','a','Subtracting rational expressions','choice','Select the simplified form of '+math(frac('u','uv+v<sup>2</sup>')+'−'+frac('v','u<sup>2</sup>+uv'))+'.',{
  ...unseenPage,choices:makeChoices([frac('u<sup>2</sup>−v<sup>2</sup>','uv'),'uv',frac('u+v','uv'),'0',frac('u−v','uv')]),correct:4,
  answerHTML:frac('u−v','uv'),answerText:'(u-v)/(uv)',lesson:'rational-polynomial',
  guide:['Factor both denominators.','Use a common denominator.','Factor the difference of squares and cancel.'],
  hints:['uv+v²=v(u+v), and u²+uv=u(u+v).','The common denominator is uv(u+v).','The numerator becomes u²−v²=(u−v)(u+v).'],
  solution:[math(frac('u<sup>2</sup>−v<sup>2</sup>','uv(u+v)')+'='+frac('(u−v)(u+v)','uv(u+v)')+'='+frac('u−v','uv'))+'.','Retain '+math('u≠0, v≠0, u+v≠0')+'.'],check:'Choice E. The factor u+v cancels; the factors u and v remain.'
 }));
 q.push(Q('p95-b','practice','b','Solving a formula for f','choice','Which choice represents '+math('hf=n(f−b)')+' after it has been solved for f?',{
  ...unseenPage,choices:makeChoices(['f=−'+frac('nb','h+n'),'f='+frac('nf−bn','h'),'f='+frac('bn','h−n'),'f='+frac('bn','n−h'),'f=hnf−hnb']),correct:3,
  answerHTML:'f='+frac('bn','n−h'),answerText:'f=bn/(n-h)',lesson:'formula-rearrangement',
  guide:['Expand the right side.','Collect and factor f.','Divide by its coefficient, then match signs.'],
  hints:['hf=nf−nb.','(h−n)f=−nb.','−nb/(h−n)=bn/(n−h).'],
  solution:[math('hf−nf=−nb')+'.',math('(h−n)f=−nb')+'.','For '+math('h≠n')+', '+math('f='+frac('bn','n−h'))+'.','If '+math('h=n')+', the original equation reduces to '+math('0=−nb')+': every f works when nb=0; otherwise no f works.'],check:'Choice D isolates f. Choice B still contains f on its right side.'
 }));
 q.push(Q('p95-c','practice','c','Rewriting one equation','numeric','Solve the system of equations.'+system('3x−3y=−15','x+2y=−2'),{
  page:468,fields:[field('x','x',-4),field('y','y',1)],answerHTML:'x=−4, y=1',answerText:'x=-4; y=1',lesson:'rewrite-one',
  guide:['Multiply the second equation by 3.','Subtract to eliminate x.','Find y, recover x, and check both originals.'],
  hints:['The rewritten second equation is 3x+6y=−6.','Subtracting gives −9y=−9.','Use y=1 in x+2y=−2.'],
  solution:[math('(3x−3y)−(3x+6y)=−15−(−6)')+' gives '+math('−9y=−9')+', hence '+math('y=1')+'.',math('x+2=−2')+' gives '+math('x=−4')+'.'],check:'3(−4)−3(1)=−15; −4+2(1)=−2.'
 }));
 q.push(Q('p95-d','practice','d','Rewriting both equations','numeric','Solve the system of equations.'+system('2x+5y=7','3x−4y=−1'),{
  page:468,fields:[field('x','x',1),field('y','y',1)],answerHTML:'x=1, y=1',answerText:'x=1; y=1',lesson:'rewrite-both',
  guide:['Choose a common magnitude for the y coefficients.','Scale both equations and add.','Recover y and check both originals.'],
  hints:['LCM(5,4)=20.','Multiply the first equation by 4 and the second by 5.','8x+20y=28 and 15x−20y=−5 add to 23x=23.'],
  solution:['Multiply the first whole equation by 4: '+math('8x+20y=28')+'. Multiply the second by 5: '+math('15x−20y=−5')+'.','Add corresponding sides: '+math('(8x+20y)+(15x−20y)=28+(−5)')+'.',math('23x=23')+' gives '+math('x=1')+'.',math('2(1)+5y=7')+' gives '+math('5y=5')+' and '+math('y=1')+'.'],check:'2+5=7; 3−4=−1.'
 }));
 q.push(Q('p95-e','practice','e','Age equation construction','numeric','Translate into an equation, then solve: The Bold One is 3 times The Timid One’s age. In 12 years, The Bold One will be 2 times The Timid One’s age. How old is The Timid One now?<p>Construct the expanded equation '+math('Ax+B=Cx+D')+'. The left side represents The Bold One’s future age; the right side represents twice The Timid One’s future age.</p>',{
  page:468,define:'Let x be The Timid One’s current age in years.',
  fields:[field('A','A: left x coefficient',3),field('B','B: left constant',12),field('C','C: right x coefficient',2),field('D','D: right constant',24),field('age','Current age',12,'years')],
  answerHTML:'3x+12=2x+24; x=12 years',answerText:'3x+12=2(x+12); x=12',lesson:'age-models',
  answerHelp:'Enter the four coefficients/constants for the stated expanded age equation, then the current age. All five fields form one exercise worth at most one point.',
  guide:['Write both current ages in terms of x.','Add 12 years to both ages.','Write and expand the future relationship.','Solve and check the current and future ratios.'],
  hints:['The current ages are x and 3x.','The future ages are x+12 and 3x+12.','Use 3x+12=2(x+12), then expand the right side.'],
  solution:[math('3x+12=2(x+12)=2x+24')+'.',math('x=24−12=12')+'.','The equation fields are '+math('A=3, B=12, C=2, D=24')+'.'],check:'Current ages: 12 and 36. In 12 years: 24 and 48, with 48=2·24.'
 }));
 // Problem Set 95: printed a–e markers are Practice cross references.
 q.push(Q('ps95-1','problem','1','Order of operations','numeric','Calculate the value of '+math('7·4<sup>2</sup>−(2+1)<sup>3</sup>')+'.',{
  page:468,fields:[field('value','Value',85)],answerHTML:'85',answerText:'85',lesson:'equations-geometry',
  guide:['Evaluate the parentheses and powers first.','Multiply, then subtract.'],hints:['4²=16 and (2+1)³=27.','7·16=112.'],
  solution:[math('7·16−27=112−27=85')+'.'],check:'The subtraction occurs after both powered quantities have been evaluated.'
 }));
 q.push(Q('ps95-2','problem','2','Order of operations with a fraction','numeric','Calculate the value of '+math(frac('−3(9−13)<sup>2</sup>','6·2'))+'.',{
  page:468,fields:[field('value','Value',-4)],answerHTML:'−4',answerText:'-4',lesson:'equations-geometry',
  guide:['Evaluate the parenthesized difference.','Square it before multiplying by −3.','Evaluate the denominator and divide.'],
  hints:['9−13=−4, whose square is 16.','The numerator is −48 and denominator is 12.'],
  solution:[math(frac('−3(−4)<sup>2</sup>','12')+'='+frac('−48','12')+'=−4')+'.'],check:'The −3 lies outside the square, so the numerator remains negative.'
 }));
 q.push(Q('ps95-3','problem','3','Distance between points','numeric','Find the distance between '+math('(0,0)')+' and '+math('(−5,−5)')+' on the coordinate plane.',{
  page:468,fields:[{...field('distance','Distance',Math.sqrt(50),'units'),placeholder:'5*sqrt(2) or decimal',tolerance:0.005}],
  answerHTML:root('50')+'=5'+root('2')+'≈7.07 units',answerText:'5*sqrt(2)',lesson:'equations-geometry',
  guide:['Find both coordinate differences.','Use the distance formula.','Simplify the radical.'],hints:['Both differences are −5.','d=√(25+25)=√50.','50=25·2.'],
  solution:[math('d='+root('(−5)<sup>2</sup>+(−5)<sup>2</sup>')+'='+root('50')+'=5'+root('2'))+' units.'],check:'The distance is nonnegative and d²=50.',answerHelp:'Use an exact expression such as 5*sqrt(2), or round the distance to the nearest hundredth.'
 }));
 q.push(Q('ps95-4','problem','4','Parabola vertex and direction','mixed','Tell the vertex of the parabola for '+math('y=−'+frac('1','3')+'x<sup>2</sup>')+', and tell whether it opens up or down.',{
  page:468,choices:makeChoices(['Opens up','Opens down']),correct:1,fields:[field('vx','Vertex x',0),field('vy','Vertex y',0)],
  answerHTML:'Vertex (0,0); opens down',answerText:'vertex (0,0); down',lesson:'equations-geometry',
  guide:['Compare with y=a(x−h)²+k.','Read the vertex and the sign of a.'],hints:['The equation has no horizontal or vertical shift.','The coefficient a is negative.'],
  solution:['The equation has '+math('h=0, k=0')+', so the vertex is '+math('(0,0)')+'.','Since '+math('a=−'+frac('1','3')+'<0')+', it opens down.'],check:'At x=0, y=0; at either positive or negative nonzero x, y is negative.'
 }));
 q.push(Q('ps95-5','problem','5','Greatest-common-factor factoring','choice','Select the factored form of '+math('abx<sup>2</sup>+aby<sup>5</sup>')+'.',{
  page:468,choices:makeChoices(['ab(x<sup>2</sup>+y<sup>5</sup>)','aby<sup>3</sup>(x+y<sup>2</sup>)','abx<sup>2</sup>(1+y<sup>3</sup>)','a<sup>2</sup>b<sup>2</sup>x<sup>2</sup>y<sup>5</sup>','ab(x<sup>2</sup>+y<sup>3</sup>)']),correct:0,
  answerHTML:'ab(x<sup>2</sup>+y<sup>5</sup>)',answerText:'ab(x^2+y^5)',lesson:'rational-polynomial',
  guide:['Find the factor shared by both terms.','Divide each term by it.'],hints:['Both terms contain ab.','The remaining terms are x² and y⁵.'],
  solution:[math('abx<sup>2</sup>+aby<sup>5</sup>=ab(x<sup>2</sup>+y<sup>5</sup>)')+'.'],check:'Choice A expands to both original terms.'
 }));
 q.push(Q('ps95-6','problem','6','Perfect-square factoring','choice','Select the factored form of '+math('p<sup>2</sup>+2pq+q<sup>2</sup>')+'.',{
  page:468,choices:makeChoices(['(p+q)<sup>2</sup>','(p+q)(q+1)','(p+q)(p−q)','(p+q)(p+1)','(p−q)<sup>2</sup>']),correct:0,
  answerHTML:'(p+q)<sup>2</sup>',answerText:'(p+q)^2',lesson:'rational-polynomial',
  guide:['Recognize two squares and twice their root product.','Choose the sign from the middle term.'],hints:['The middle term is +2pq.','Use the square of p+q.'],
  solution:[math('p<sup>2</sup>+2pq+q<sup>2</sup>=(p+q)<sup>2</sup>')+'.'],check:'Choice A. Expanding gives p²+pq+qp+q².'
 }));
 q.push(Q('ps95-7','problem','7','Difference-of-squares factoring','choice','Select the factored form of '+math('81c<sup>2</sup>v<sup>2</sup>−49d<sup>4</sup>u<sup>4</sup>')+'.',{
  page:468,choices:makeChoices(['(81cv+49d<sup>2</sup>u<sup>2</sup>)(81cv−49d<sup>2</sup>u<sup>2</sup>)','(9cv+7d<sup>2</sup>u<sup>2</sup>)<sup>2</sup>','(9cv+7d<sup>2</sup>u<sup>2</sup>)(9cv−7d<sup>2</sup>u<sup>2</sup>)','(9cv+7du)(9cv−7du)','(9cv−7d<sup>2</sup>u<sup>2</sup>)<sup>2</sup>']),correct:2,
  answerHTML:'(9cv+7d<sup>2</sup>u<sup>2</sup>)(9cv−7d<sup>2</sup>u<sup>2</sup>)',answerText:'(9cv+7d^2u^2)(9cv-7d^2u^2)',lesson:'rational-polynomial',
  guide:['Take the square root of each monomial.','Use one plus and one minus factor.'],hints:['81c²v²=(9cv)².','49d⁴u⁴=(7d²u²)².'],
  solution:[math('(9cv)<sup>2</sup>−(7d<sup>2</sup>u<sup>2</sup>)<sup>2</sup>')+' factors as '+math('(9cv+7d<sup>2</sup>u<sup>2</sup>)(9cv−7d<sup>2</sup>u<sup>2</sup>)')+'.'],check:'Choice C. The middle products cancel.'
 }));
 q.push(Q('ps95-8','problem','8','Combining like terms','choice','Select the simplified form of '+math('3.1m<sup>2</sup>n+5.7m<sup>2</sup>n')+'.',{
  page:468,choices:makeChoices(['8.8m<sup>4</sup>n','17.67m<sup>4</sup>n<sup>2</sup>','8.8m<sup>4</sup>n<sup>2</sup>','8.8m<sup>2</sup>n','17.67m<sup>2</sup>n']),correct:3,
  answerHTML:'8.8m<sup>2</sup>n',answerText:'8.8m^2n',lesson:'rational-polynomial',
  guide:['Confirm the variable parts are identical.','Add only the coefficients.'],hints:['Both variable parts are m²n.','3.1+5.7=8.8.'],
  solution:[math('(3.1+5.7)m<sup>2</sup>n=8.8m<sup>2</sup>n')+'.'],check:'Choice D retains the original exponents.'
 }));
 q.push(Q('ps95-9','problem','9','Polynomial multiplication','choice','Select the simplified form of '+math('(x−y)(x<sup>2</sup>−2xy+y<sup>2</sup>)')+'.',{
  page:468,choices:makeChoices(['x<sup>3</sup>−6x<sup>2</sup>y+4xy<sup>2</sup>−y<sup>3</sup>','x<sup>2</sup>+x−2xy−y+y<sup>2</sup>','x<sup>3</sup>−2x<sup>2</sup>y+2xy<sup>2</sup>−y<sup>3</sup>','x<sup>3</sup>−2xy−y<sup>3</sup>','x<sup>3</sup>−3x<sup>2</sup>y+3xy<sup>2</sup>−y<sup>3</sup>']),correct:4,
  answerHTML:'x<sup>3</sup>−3x<sup>2</sup>y+3xy<sup>2</sup>−y<sup>3</sup>',answerText:'x^3-3x^2y+3xy^2-y^3',lesson:'rational-polynomial',
  guide:['Distribute x across the trinomial.','Distribute −y across the trinomial.','Combine like terms.'],
  hints:['The first row is x³−2x²y+xy².','The second row is −x²y+2xy²−y³.','Combine the two x²y terms and two xy² terms.'],
  solution:[math('x<sup>3</sup>−2x<sup>2</sup>y+xy<sup>2</sup>−x<sup>2</sup>y+2xy<sup>2</sup>−y<sup>3</sup>')+'.',math('x<sup>3</sup>−3x<sup>2</sup>y+3xy<sup>2</sup>−y<sup>3</sup>')+'.'],check:'Choice E also equals (x−y)³.'
 }));
 q.push(Q('ps95-10','problem','10','Multiplying rational expressions','choice','Select the simplified form of '+math(frac('a<sup>2</sup>+3ab+2b<sup>2</sup>','5a<sup>2</sup>b')+'·'+frac('10ab<sup>2</sup>','a+2b'))+'.',{
  page:468,choices:makeChoices(['2a<sup>2</sup>b+2ab<sup>2</sup>',frac('2ab+2b<sup>2</sup>','a'),frac('2a<sup>2</sup>b<sup>2</sup>+2ab<sup>3</sup>','5a<sup>2</sup>b'),frac('2ab+2b','a'),frac('a<sup>2</sup>+10ab<sup>2</sup>+3ab+2b<sup>2</sup>','5a<sup>2</sup>b+a+2b')]),correct:1,
  answerHTML:frac('2ab+2b<sup>2</sup>','a'),answerText:'(2ab+2b^2)/a',lesson:'rational-polynomial',
  guide:['Factor the quadratic numerator.','Cancel common factors.','Simplify and match the printed choice.'],
  hints:['a²+3ab+2b²=(a+b)(a+2b).','Cancel a+2b, then simplify 10ab²/(5a²b)=2b/a.','Distribute 2b over a+b.'],
  solution:[math(frac('(a+b)(a+2b)','5a<sup>2</sup>b')+'·'+frac('10ab<sup>2</sup>','a+2b')+'='+frac('2b(a+b)','a')+'='+frac('2ab+2b<sup>2</sup>','a'))+'.','Original restrictions: '+math('a≠0, b≠0, a+2b≠0')+'.'],check:'Choice B.'
 }));
 q.push(Q('ps95-11','problem','11','Subtracting rational expressions','choice','Select the simplified form of '+math(frac('x','xy+y<sup>2</sup>')+'−'+frac('y','x<sup>2</sup>+xy'))+'.',{
  page:468,sourcePracticeReference:'a',choices:makeChoices([frac('x+y','xy'),frac('x−y','xy'),'0','xy',frac('x<sup>2</sup>−y<sup>2</sup>','xy')]),correct:1,
  answerHTML:frac('x−y','xy'),answerText:'(x-y)/(xy)',lesson:'rational-polynomial',
  guide:['Factor both denominators.','Use xy(x+y) as the common denominator.','Factor the difference of squares.'],
  hints:['xy+y²=y(x+y), and x²+xy=x(x+y).','The combined numerator is x²−y².','Cancel the common factor x+y.'],
  solution:[math(frac('x<sup>2</sup>−y<sup>2</sup>','xy(x+y)')+'='+frac('(x−y)(x+y)','xy(x+y)')+'='+frac('x−y','xy'))+'.','Keep '+math('x≠0, y≠0, x+y≠0')+'.'],check:'Choice B.'
 }));
 q.push(Q('ps95-12','problem','12','Polynomial division','choice','Select the simplified form of '+math(frac('x<sup>3</sup>−2x<sup>2</sup>y−7xy<sup>2</sup>+2y<sup>3</sup>','x+2y'))+'.',{
  page:469,choices:makeChoices(['x<sup>2</sup>−4xy+y<sup>2</sup>','x<sup>2</sup>−2x+7y+y<sup>2</sup>','x<sup>2</sup>+2xy+y<sup>2</sup>','x<sup>2</sup>−7xy+y<sup>2</sup>','x<sup>2</sup>−2x<sup>2</sup>y−7xy<sup>2</sup>+y<sup>2</sup>']),correct:0,
  answerHTML:'x<sup>2</sup>−4xy+y<sup>2</sup>',answerText:'x^2-4xy+y^2',lesson:'rational-polynomial',
  guide:['Divide in descending powers of x.','Repeat divide, multiply, subtract, and bring down.','Check by multiplying the quotient by x+2y.'],
  hints:['The first quotient term is x².','After subtracting x²(x+2y), the remaining leading term is −4x²y.','The next terms are −4xy and y².'],
  solution:['Divide leading terms: '+math('x<sup>3</sup>÷x=x<sup>2</sup>')+'. Multiply back: '+math('x<sup>2</sup>(x+2y)=x<sup>3</sup>+2x<sup>2</sup>y')+'.','Subtract this product from the numerator to obtain '+math('−4x<sup>2</sup>y−7xy<sup>2</sup>+2y<sup>3</sup>')+'.','The next quotient term is '+math('−4xy')+'. Multiply: '+math('−4xy(x+2y)=−4x<sup>2</sup>y−8xy<sup>2</sup>')+'. Subtract to obtain '+math('xy<sup>2</sup>+2y<sup>3</sup>')+'.','The final quotient term is '+math('y<sup>2</sup>')+'. Its product '+math('y<sup>2</sup>(x+2y)=xy<sup>2</sup>+2y<sup>3</sup>')+' leaves remainder 0.','The quotient is '+math('x<sup>2</sup>−4xy+y<sup>2</sup>')+'. The original denominator requires '+math('x+2y≠0')+'.'],check:'Multiplying (x+2y)(x²−4xy+y²) gives x³−2x²y−7xy²+2y³, so choice A is correct.'
 }));
 q.push(Q('ps95-13','problem','13','Linear equation','numeric','Solve '+math('6(x−5)=2(x+9)')+'.',{
  page:469,fields:[field('x','x',12)],answerHTML:'x=12',answerText:'x=12',lesson:'equations-geometry',
  guide:['Distribute on both sides.','Collect x terms and constants.','Divide and check.'],hints:['6x−30=2x+18.','4x=48.'],
  solution:[math('6x−2x=18+30')+' gives '+math('4x=48')+', hence '+math('x=12')+'.'],check:'6(12−5)=42 and 2(12+9)=42.'
 }));
 q.push(Q('ps95-14','problem','14','Square-equation solutions','choice','Solve '+math('2x<sup>2</sup>+3x<sup>2</sup>=50')+' and select the choice containing all solutions.',{
  page:469,choices:makeChoices(['5, −5','3'+root('5')+', −3'+root('5'),fourthRoot('10')+', −'+fourthRoot('10'),root('5')+', −'+root('5'),root('10')+', −'+root('10')]),correct:4,
  answerHTML:'x='+root('10')+' or x=−'+root('10'),answerText:'x=sqrt(10),-sqrt(10)',lesson:'equations-geometry',
  guide:['Combine the x² terms.','Isolate x².','Include both square roots.'],hints:['5x²=50.','x²=10.','A positive square has positive and negative square-root solutions.'],
  solution:[math('5x<sup>2</sup>=50')+' gives '+math('x<sup>2</sup>=10')+'.','Therefore '+math('x=±'+root('10'))+'.'],check:'Choice E. Both values give 5·10=50; choice C contains fourth roots.'
 }));
 q.push(Q('ps95-15','problem','15','Formula evaluation','numeric','In '+math('Q=2d+3l<sup>2</sup>')+', find Q when '+math('d=9')+' and '+math('l=3')+'.',{
  page:469,fields:[field('Q','Q',45)],answerHTML:'Q=45',answerText:'Q=45',lesson:'equations-geometry',
  guide:['Substitute both given values.','Square l before multiplying by 3.','Add the two terms.'],hints:['l²=3²=9.','2(9)+3(9)=18+27.'],
  solution:[math('Q=2(9)+3(3)<sup>2</sup>=18+27=45')+'.'],check:'The exponent applies to l alone.'
 }));
 q.push(Q('ps95-16','problem','16','Solving a formula for k','choice','Which choice represents '+math('jk=l(k−a)')+' after it has been solved for k?',{
  page:469,sourcePracticeReference:'b',choices:makeChoices(['k='+frac('al','j−l'),'k='+frac('al','l−j'),'k='+frac('lk−al','j'),'k=jlk−jla','k='+frac('al','j+l')]),correct:1,
  answerHTML:'k='+frac('al','l−j'),answerText:'k=al/(l-j)',lesson:'formula-rearrangement',
  guide:['Expand the right side.','Collect and factor k.','Divide and account for the sign.'],hints:['jk=lk−al.','(j−l)k=−al.','−al/(j−l)=al/(l−j).'],
  solution:[math('jk−lk=−al')+' gives '+math('(j−l)k=−al')+'.','For '+math('j≠l')+', '+math('k='+frac('al','l−j'))+'.','If '+math('j=l')+', every k works when al=0; otherwise no k works.'],check:'Choice B isolates k; choice C still contains k on its right side.'
 }));
 q.push(Q('ps95-17','problem','17','Point-slope line equation','choice','Select the equation for the line crossing '+math('(−9,−4)')+' with slope 6.',{
  page:469,choices:makeChoices(['y+4=6(x+9)','y−9=2(x−4)','y−4=6(x−9)','y+4=3(x+9)','y+9=6(x+4)']),correct:0,
  answerHTML:'y+4=6(x+9)',answerText:'y+4=6(x+9)',lesson:'equations-geometry',
  guide:['Use y−y₁=m(x−x₁).','Substitute the given point and slope.','Simplify the two subtractions of negative coordinates.'],
  hints:['Use m=6, x₁=−9, y₁=−4.','y−(−4)=6(x−(−9)).'],
  solution:[math('y+4=6(x+9)')+'.'],check:'Choice A has slope 6, and the source point gives 0=0.'
 }));
 q.push(Q('ps95-18','problem','18','Line equation from two points','choice','Select the equation for the line crossing '+math('(1,−2)')+' and '+math('(−3,2)')+'.',{
  page:469,choices:makeChoices(['y−2=−4(x+3)','y+2=−3(x−1)','y+2=−1(x−3)','y−2=−1(x+3)','y−2=−1(x+1)']),correct:3,
  answerHTML:'y−2=−1(x+3)',answerText:'y-2=-1(x+3)',lesson:'equations-geometry',
  guide:['Compute slope from the two labeled points.','Use either point in point-slope form.','Check both points in the selected equation.'],
  hints:['m=(2−(−2))/(−3−1)=4/(−4)=−1.','Using (−3,2) gives y−2=−1(x+3).'],
  solution:[math('m=−1')+'.','Through '+math('(−3,2)')+', the line is '+math('y−2=−1(x+3)')+', equivalent to '+math('y=−x−1')+'.'],check:'Choice D gives y=−2 at x=1 and y=2 at x=−3.'
 }));
 q.push(Q('ps95-19','problem','19','Addition method','numeric','Solve the system of equations.'+system('x+y=49','4x−y=56'),{
  page:469,fields:[field('x','x',21),field('y','y',28)],answerHTML:'x=21, y=28',answerText:'x=21; y=28',lesson:'elimination-setup',
  guide:['Inspect the y terms.','Add directly to eliminate y.','Find x, then y, and check.'],hints:['+y and −y are already opposites.','Adding gives 5x=105.','Use x=21 in x+y=49.'],
  solution:[math('5x=105')+' gives '+math('x=21')+'.',math('21+y=49')+' gives '+math('y=28')+'.'],check:'21+28=49; 4(21)−28=56.'
 }));
 q.push(Q('ps95-20','problem','20','Rewriting one equation','numeric','Solve the system of equations.'+system('2x−2y=−12','x+3y=−2'),{
  page:469,sourcePracticeReference:'c',fields:[field('x','x',-5),field('y','y',1)],answerHTML:'x=−5, y=1',answerText:'x=-5; y=1',lesson:'rewrite-one',
  guide:['Multiply the second equation by 2.','Subtract to eliminate x.','Solve y, recover x, and check.'],hints:['The rewritten equation is 2x+6y=−4.','Subtracting gives −8y=−8.','Use y=1 in x+3y=−2.'],
  solution:['Multiply the second whole equation by 2 to obtain '+math('2x+6y=−4')+'.','Subtract it from the first: '+math('(2x−2y)−(2x+6y)=−12−(−4)')+'.',math('−8y=−8')+' gives '+math('y=1')+'.',math('x+3=−2')+' gives '+math('x=−5')+'.'],check:'2(−5)−2(1)=−12; −5+3(1)=−2.'
 }));
 q.push(Q('ps95-21','problem','21','Rewriting both equations','numeric','Solve the system of equations.'+system('3x+4y=−1','2x−3y=5'),{
  page:469,sourcePracticeReference:'d',fields:[field('x','x',1),field('y','y',-1)],answerHTML:'x=1, y=−1',answerText:'x=1; y=-1',lesson:'rewrite-both',
  guide:['Choose common magnitude 12 for the y coefficients.','Scale both equations and add.','Find x and y, then check.'],hints:['Multiply the first equation by 3 and the second by 4.','9x+12y=−3 and 8x−12y=20.','Adding gives 17x=17.'],
  solution:['Multiply the first whole equation by 3: '+math('9x+12y=−3')+'. Multiply the second by 4: '+math('8x−12y=20')+'.','Add corresponding sides: '+math('(9x+12y)+(8x−12y)=−3+20')+'.',math('17x=17')+' gives '+math('x=1')+'.',math('2(1)−3y=5')+' gives '+math('−3y=3')+' and '+math('y=−1')+'.'],check:'3(1)+4(−1)=−1; 2(1)−3(−1)=5.'
 }));
 q.push(Q('ps95-22','problem','22','Age equation construction','numeric','Translate into an equation, then solve: The Crusty One is 4 times The Kind One’s age. In 10 years, The Crusty One will be 3 times The Kind One’s age. How old is The Kind One now?<p>Construct the expanded equation '+math('Ax+B=Cx+D')+'. The left side represents The Crusty One’s future age; the right side represents three times The Kind One’s future age.</p>',{
  page:469,sourcePracticeReference:'e',define:'Let x be The Kind One’s current age in years.',
  fields:[field('A','A: left x coefficient',4),field('B','B: left constant',10),field('C','C: right x coefficient',3),field('D','D: right constant',30),field('age','Current age',20,'years')],
  answerHTML:'4x+10=3x+30; x=20 years',answerText:'4x+10=3(x+10); x=20',lesson:'age-models',
  answerHelp:'Enter the four coefficients/constants for the stated expanded age equation, then the current age. All five fields form one exercise worth at most one point.',
  guide:['Write the two current ages.','Add 10 years to each.','Construct and expand the future relationship.','Solve and check both time points.'],
  hints:['The current ages are x and 4x.','The future ages are x+10 and 4x+10.','Use 4x+10=3(x+10).'],
  solution:[math('4x+10=3(x+10)=3x+30')+'.',math('x=30−10=20')+'.','The equation fields are '+math('A=4, B=10, C=3, D=30')+'.'],check:'Current ages: 20 and 80. In 10 years: 30 and 90, with 90=3·30.'
 }));
 return q;
}

function referenceHtml(){return `<p>Methods for Lesson 95 and its review exercises.</p><div class="reference-grid">
 <div class="reference-item"><h4>Equivalent equations</h4><p>Multiply every term on both sides by the same nonzero factor.</p></div>
 <div class="reference-item"><h4>Elimination</h4><p>Add opposite terms; subtract equal terms. Rewrite one or both equations first when needed.</p></div>
 <div class="reference-item"><h4>Integer multipliers</h4><p>Use the least common multiple of coefficient magnitudes as a convenient target. Suitable fractional multipliers are also valid.</p></div>
 <div class="reference-item"><h4>Finish and check</h4><p>Substitute into an original equation, then check the solution pair in both originals.</p></div>
 <div class="reference-item"><h4>Rational expressions</h4><p>Factor denominators, build common denominators for sums, and cancel factors in products. Keep original restrictions.</p></div>
 <div class="reference-item"><h4>Polynomial division</h4><p>Divide → multiply → subtract → bring down. Check the quotient by multiplication.</p></div>
 <div class="reference-item"><h4>Rearranging formulas</h4><p>Expand → collect requested-variable terms → factor → divide by the nonzero coefficient.</p></div>
 <div class="reference-item"><h4>Distance</h4>${math('d='+root('(Δx)<sup>2</sup>+(Δy)<sup>2</sup>'))}</div>
 <div class="reference-item"><h4>Point-slope form</h4>${math('y−y<sub>1</sub>=m(x−x<sub>1</sub>)')}<br>${math('m='+frac('y<sub>2</sub>−y<sub>1</sub>','x<sub>2</sub>−x<sub>1</sub>'))}</div>
 <div class="reference-item"><h4>Parabola</h4>${math('y=a(x−h)<sup>2</sup>+k')}<p>Vertex (h,k); a&gt;0 opens up, a&lt;0 opens down.</p></div>
 <div class="reference-item"><h4>Square equation</h4><p>For c&gt;0, x²=c has two solutions, ±√c.</p></div>
 <div class="reference-item"><h4>Age model</h4>${math('rx+t=s(x+t)')}<p>x is the younger current age. Add the same elapsed years to both ages.</p></div>
 </div>`;}

const packageDef={
 id:'lesson-095',number:95,chapter:'Chapter 13',title:'Rewriting First',
 contentVersion:'course-package-1.0',sourceRevision:'lesson95-2026-10-14-photos',
 heroTitle:'Rewrite first.<br><em>Then eliminate.</em>',
 description:'Scale one or both equations to create matching or opposite terms, solve the resulting system, and check both originals. Complete Practice 95 and Problem Set 95, including constructed age equations.',
 heroArt:`<div class="art-caption"><span>Equivalent equations</span><span>Elimination</span></div><div class="formula">5x+3y=−19<br>9x−2y=25</div><div class="connector">↓ multiply by 2 and 3</div><div class="formula">10x+6y=−38<br>27x−6y=75</div><p class="art-foot">Add to eliminate y, then recover and check both values.</p>`,
 topics,
 sections:[
  {id:'practice',label:'Practice 95',intro:'Five exercises on rational expressions, formula rearrangement, rewriting systems, and constructing an age equation.'},
  {id:'problem',label:'Problem Set 95',intro:'Twenty-two review exercises on arithmetic, geometry, factoring, rational expressions, equations, formulas, line equations, linear systems, and an age application.'}
 ],
 buildQuestions,referenceHtml,
 sourceStatus:{
  status:'PARTIALLY_SOURCE_VERIFIED',
  pages:'Visible pages 466, 468, 469; instructional/Practice a–b sheet page number cropped',
  verified:'2026-10-14 CT: independent source and mathematical review completed; source limitations explicitly recorded',
  uncertainItems:[
   'IMG_4398/IMG_4399: instructional/Practice a–b sheet printed page number is outside the photographs.',
   'IMG_4397: the claim that scaling only one equation will not help requires a whole-number qualification; suitable fractional scaling is valid. App instruction explicitly qualifies this claim.'
  ]
 }
};
global.Algebra2CourseRegistry.register(packageDef);
})(window);
