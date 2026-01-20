// 1. إعدادات الاتصال بقاعدة البيانات
const SUPABASE_URL = 'https://pfepcvvccgcznshqulhz.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZXBjdnZjY2djem5zaHF1bGh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NjQxNjQsImV4cCI6MjA4NDQ0MDE2NH0.olTCdMWYUZ-TSzucoETKTVwBSiIPjX4U2UfbVGQbgfw';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. دوال مساعدة لتنسيق الأرقام والوقت
function toArabicDigits(str) {
    return str.toString().replace(/[0-9]/g, w => ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'][w]);
}

function get24Hour(hour, period) {
    let h = parseInt(hour);
    if (period === "مساءً" && h !== 12) h += 12;
    if (period === "صباحاً" && h === 12) h = 0;
    return h;
}

// 3. تحميل البيانات الأولية
document.addEventListener('DOMContentLoaded', () => {
    updatePublicSchedule();
    document.querySelectorAll('.btn-book').forEach(btn => {
        btn.addEventListener('click', () => showModal(btn.getAttribute('data-name')));
    });
});

// 4. نافذة الحجز الرئيسية
function showModal(consoleName) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm';
    modal.innerHTML = `
        <div class="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl text-right" dir="rtl">
            <h3 class="text-2xl font-bold mb-6 text-blue-700 text-center border-b pb-4">حجز ${consoleName}</h3>
            <form id="bookingForm" class="space-y-4">
                <input type="text" id="uName" placeholder="الاسم" required class="w-full p-4 border rounded-2xl font-bold">
                <input type="tel" id="uPhone" placeholder="رقم الموبايل" required class="w-full p-4 border rounded-2xl font-bold text-center">
                
                <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <p class="text-center font-bold text-blue-800 text-sm mb-3">حدد الوقت بدقة</p>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex gap-1">
                            <input type="number" id="sT" placeholder="من" min="1" max="12" required class="w-full p-2 border rounded-xl text-center font-bold">
                            <select id="sP" class="border rounded-xl font-bold bg-white"><option value="مساءً">مساءً</option><option value="صباحاً">صباحاً</option></select>
                        </div>
                        <div class="flex gap-1">
                            <input type="number" id="eT" placeholder="إلى" min="1" max="12" required class="w-full p-2 border rounded-xl text-center font-bold">
                            <select id="eP" class="border rounded-xl font-bold bg-white"><option value="مساءً">مساءً</option><option value="صباحاً">صباحاً</option></select>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-1">
                    <label class="text-xs text-gray-500 mr-2 font-bold">تاريخ الحجز</label>
                    <input type="date" id="uDate" required class="w-full p-4 border rounded-2xl font-bold text-center">
                </div>
                
                <div class="grid grid-cols-2 gap-4 pt-4">
                    <button type="button" id="closeBtn" class="bg-gray-200 py-4 rounded-2xl font-bold">إلغاء</button>
                    <button type="submit" id="subBtn" class="bg-blue-600 text-white py-4 rounded-2xl font-bold">تأكيد الحجز</button>
                </div>
            </form>
        </div>`;
    
    document.body.appendChild(modal);

    // --- منع اختيار تاريخ قديم من التقويم ---
    const dateInput = modal.querySelector('#uDate');
    const todayStr = new Date().toISOString().split('T')[0];
    dateInput.min = todayStr; 
    dateInput.value = todayStr;

    modal.querySelector('#closeBtn').onclick = () => modal.remove();

    modal.querySelector('#bookingForm').onsubmit = async (e) => {
        e.preventDefault();
        const btn = modal.querySelector('#subBtn');
        const selectedDate = modal.querySelector('#uDate').value;

        // --- الشرط المطلوب: منع التاريخ القديم عند الضغط على تأكيد ---
        if (selectedDate < todayStr) {
            alert("❌ خطأ: لا يمكنك اختيار تاريخ في الماضي!");
            return;
        }

        const newStart = get24Hour(modal.querySelector('#sT').value, modal.querySelector('#sP').value);
        const newEnd = get24Hour(modal.querySelector('#eT').value, modal.querySelector('#eP').value);

        if (newEnd <= newStart) {
            alert("❌ خطأ: وقت النهاية يجب أن يكون بعد وقت البداية");
            return;
        }

        btn.disabled = true; btn.innerText = 'جاري التحقق...';

        // فحص تداخل المواعيد
        const { data: existing } = await supabaseClient
            .from('bookings')
            .select('time')
            .eq('console', consoleName)
            .eq('date', selectedDate);

        let isOverlapping = false;
        if (existing) {
            existing.forEach(b => {
                const times = b.time.match(/(\d+)\s+(مساءً|صباحاً)/g);
                if (times && times.length === 2) {
                    const exS = get24Hour(times[0].split(' ')[0], times[0].split(' ')[1]);
                    const exE = get24Hour(times[1].split(' ')[0], times[1].split(' ')[1]);
                    if (newStart < exE && newEnd > exS) isOverlapping = true;
                }
            });
        }

        if (isOverlapping) {
            alert('❌ الوقت متداخل مع حجز آخر!');
            btn.disabled = false; btn.innerText = 'تأكيد الحجز';
            return;
        }

        // إرسال البيانات
        const timeText = `من ${modal.querySelector('#sT').value} ${modal.querySelector('#sP').value} إلى ${modal.querySelector('#eT').value} ${modal.querySelector('#eP').value}`;
        const { error } = await supabaseClient.from('bookings').insert([{
            name: modal.querySelector('#uName').value,
            phone: modal.querySelector('#uPhone').value,
            console: consoleName,
            date: selectedDate,
            time: timeText
        }]);

        if (!error) {
            localStorage.setItem('myPlayZonePhone', modal.querySelector('#uPhone').value);
            alert('✅ تم الحجز!');
            location.reload();
        } else {
            alert('حدث خطأ');
            btn.disabled = false;
        }
    };
}

async function updatePublicSchedule() {
    const container = document.getElementById('publicSchedule');
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabaseClient.from('bookings').select('console, time').eq('date', today);
    if (data && data.length > 0) {
        container.innerHTML = '';
        data.forEach(b => {
            container.innerHTML += `<div class="bg-red-50 border border-red-100 p-4 rounded-2xl flex justify-between items-center shadow-sm"><span class="font-bold">${b.console}</span><span class="text-xs font-bold text-red-600 bg-white px-3 py-1 rounded-full border">${toArabicDigits(b.time)}</span></div>`;
        });
    } else {
        container.innerHTML = '<p class="text-center col-span-full text-gray-400 py-4">لا توجد حجوزات اليوم</p>';
    }
}