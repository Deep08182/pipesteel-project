(function() {
    // Inject CSS
    const styles = `
        #ar-chatbot {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            font-family: 'Inter', sans-serif;
        }
        #ar-chatbot-button {
            width: 56px;
            height: 56px;
            background-color: #C05621;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(192, 86, 33, 0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        #ar-chatbot-button:hover {
            transform: scale(1.08);
            background-color: #B5541F;
        }
        #ar-chatbot-window {
            position: absolute;
            bottom: 70px;
            right: 0;
            width: 340px;
            height: 480px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 12px 36px rgba(11, 18, 32, 0.25);
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #E2E8F0;
        }
        #ar-chatbot-header {
            background: #0B1220;
            color: white;
            padding: 16px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #ar-chatbot-header-title {
            font-size: 14px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        #ar-chatbot-close {
            cursor: pointer;
            color: #94A3B8;
            font-size: 16px;
        }
        #ar-chatbot-close:hover {
            color: white;
        }
        #ar-chatbot-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            background: #F8FAFC;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .msg-bot {
            background: white;
            padding: 10px 14px;
            border-radius: 12px 12px 12px 2px;
            font-size: 13px;
            color: #1E293B;
            box-shadow: 0 1px 3px rgba(0,0,0,0.06);
            align-self: flex-start;
            max-width: 88%;
            line-height: 1.45;
            border: 1px solid #E2E8F0;
        }
        .msg-user {
            background: #0B1220;
            color: white;
            padding: 10px 14px;
            border-radius: 12px 12px 2px 12px;
            font-size: 13px;
            align-self: flex-end;
            max-width: 88%;
            line-height: 1.4;
        }
        #ar-chatbot-input-area {
            padding: 12px;
            background: white;
            border-top: 1px solid #E2E8F0;
            display: flex;
            gap: 8px;
        }
        #ar-chatbot-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #CBD5E1;
            border-radius: 8px;
            outline: none;
            font-size: 13px;
        }
        #ar-chatbot-input:focus {
            border-color: #C05621;
        }
        #ar-chatbot-send {
            background: #C05621;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 14px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
        }
        #ar-chatbot-send:hover {
            background: #B5541F;
        }
        .quick-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 6px;
        }
        .quick-chip {
            background: #F1F5F9;
            border: 1px solid #CBD5E1;
            border-radius: 12px;
            padding: 3px 8px;
            font-size: 11px;
            color: #0B1220;
            cursor: pointer;
            font-weight: 500;
        }
        .quick-chip:hover {
            background: #E2E8F0;
            border-color: #94A3B8;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Inject HTML
    const html = `
        <div id="ar-chatbot">
            <div id="ar-chatbot-window">
                <div id="ar-chatbot-header">
                    <div id="ar-chatbot-header-title">
                        <span style="width:8px; height:8px; background:#22C55E; border-radius:50%;"></span>
                        Steelcore Engineering Bot
                    </div>
                    <div style="display:flex; gap: 12px; align-items:center;">
                        <a href="https://wa.me/919823012345?text=Hi,%20I%20have%20an%20inquiry%20regarding%20Steel%20&%20Aluminium%20products" target="_blank" title="Chat on WhatsApp" style="color: #25D366; display:flex;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                        </a>
                        <span id="ar-chatbot-close">✕</span>
                    </div>
                </div>
                <div id="ar-chatbot-messages">
                    <div class="msg-bot">
                        Hello! I am Steelcore's technical assistant. Ask me about steel grades (IS 2062, S355), aluminium T-slot extrusions, RFQ submissions, or tracking your order.
                        <div class="quick-chips">
                            <span class="quick-chip" onclick="window.sendChatQuery('Steel Beams & Grades')">Steel Beams</span>
                            <span class="quick-chip" onclick="window.sendChatQuery('Aluminium T-Slot Profiles')">Aluminium T-Slots</span>
                            <span class="quick-chip" onclick="window.sendChatQuery('How do I submit an RFQ?')">Submit RFQ</span>
                            <span class="quick-chip" onclick="window.sendChatQuery('Track my enquiry')">Track Order</span>
                        </div>
                    </div>
                </div>
                <div id="ar-chatbot-input-area">
                    <input type="text" id="ar-chatbot-input" placeholder="Ask about products, specs, or RFQs..." />
                    <button id="ar-chatbot-send">Send</button>
                </div>
            </div>
            <div id="ar-chatbot-button" title="Chat with Engineering Support">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    // Elements
    const btn = document.getElementById('ar-chatbot-button');
    const win = document.getElementById('ar-chatbot-window');
    const closeBtn = document.getElementById('ar-chatbot-close');
    const input = document.getElementById('ar-chatbot-input');
    const sendBtn = document.getElementById('ar-chatbot-send');
    const msgs = document.getElementById('ar-chatbot-messages');

    btn.addEventListener('click', () => {
        win.style.display = win.style.display === 'flex' ? 'none' : 'flex';
        if (win.style.display === 'flex') input.focus();
    });

    closeBtn.addEventListener('click', () => {
        win.style.display = 'none';
    });

    const responses = [
        {
            keywords: ['steel', 'beam', 'ismb', 'structural', 'is 2062', 's355', 'column'],
            reply: 'We manufacture hot-rolled and built-up Structural Steel Beams (ISMB 100 to 900) and heavy columns in IS 2062 Grade E250 / E350 and EN 10025 S355JR with 100% UT testing and SA 2.5 shot blast primer.'
        },
        {
            keywords: ['aluminium', 'aluminum', 't-slot', 'profile', 'extrusion', '6063', 'solar'],
            reply: 'Our Aluminium Modular T-Slot Extrusions (AA 6063-T6) range from 20x20 to 90x90 with 15µm natural silver anodizing. We also manufacture solar mounting rails (AA 6005-T5).'
        },
        {
            keywords: ['box girder', 'crane', 'girder', 'saw', 'welding'],
            reply: 'We fabricate custom Submerged Arc Welded (SAW) box girders up to 36-meter single spans for heavy industrial crane runways and highway bridges under ASME Section IX and AWS D1.1.'
        },
        {
            keywords: ['rfq', 'quote', 'quotation', 'price', 'cost', 'submit'],
            reply: 'You can submit an RFQ on our Contact page with CAD drawings (.dwg/.step/.pdf) and BoQ. Our engineering estimators provide itemized quotes with 18% GST within 2 business hours!'
        },
        {
            keywords: ['track', 'status', 'enquiry', 'order'],
            reply: 'You can live-track your RFQ across 10 stages (Submitted → Review → Quoted → Confirmed → Production → Dispatched) on our Track Enquiry page using your RFQ-2026-XXXXX reference ID.'
        },
        {
            keywords: ['plant', 'factory', 'location', 'chakan', 'sanand'],
            reply: 'We operate 2 heavy manufacturing facilities: Plant 1 in MIDC Chakan, Pune (Maharashtra) and Plant 2 in GIDC Sanand, Ahmedabad (Gujarat) with 120,000 MT annual capacity.'
        },
        {
            keywords: ['certificate', 'iso', 'mtc', 'ndt', 'test'],
            reply: 'All shipments include EN 10204 3.1 Mill Test Certificates with chemical spectrometry, 1000 kN UTM tensile testing, -40°C Charpy impact testing, and ASNT NDT Level II ultrasonic reports.'
        },
        {
            keywords: ['hello', 'hi', 'hey'],
            reply: 'Hello! How can I assist you today with our steel and aluminium manufacturing capabilities or an ongoing quotation?'
        }
    ];

    function addMessage(text, type) {
        const div = document.createElement('div');
        div.className = type === 'user' ? 'msg-user' : 'msg-bot';
        div.innerText = text;
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
    }

    function processInput(customText) {
        const text = customText || input.value.trim();
        if (!text) return;
        
        addMessage(text, 'user');
        if (!customText) input.value = '';

        const lowerText = text.toLowerCase();
        let replied = false;

        for (let r of responses) {
            if (r.keywords.some(k => lowerText.includes(k))) {
                setTimeout(() => addMessage(r.reply, 'bot'), 500);
                replied = true;
                break;
            }
        }

        if (!replied) {
            setTimeout(() => {
                addMessage("Thank you for your question! For custom engineering specifications or urgent pricing, please submit an RFQ or contact our sales team directly at rfq@arlaminators.com / +91 98230 12345.", 'bot');
            }, 500);
        }
    }

    window.sendChatQuery = function(text) {
        processInput(text);
    };

    sendBtn.addEventListener('click', () => processInput());
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') processInput();
    });
})();
