import os
import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_pdf_report(portfolio_results, quality_summary):
    """
    Generates a professional PDF project report buffer using ReportLab.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#0f172a'),
        alignment=1, # Center
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#2563eb'),
        alignment=1,
        spaceAfter=15
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#334155'),
        spaceAfter=8
    )

    disclaimer_style = ParagraphStyle(
        'DisclaimerText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#64748b'),
        spaceBefore=10
    )

    story = []

    # Title & Metadata Header
    story.append(Paragraph("Financial Portfolio Risk Analysis", title_style))
    story.append(Paragraph("CS5403 – Machine Learning | Academic PBL Project Report", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2563eb'), spaceAfter=12))

    meta_data = [
        [Paragraph("<b>Team Members:</b> Deepika R, Dharshana M", body_style), Paragraph("<b>Department:</b> B.Tech AI & DS", body_style)],
        [Paragraph("<b>Mentor:</b> Dr. Shanmuga Sundaram", body_style), Paragraph("<b>Course:</b> CS5403 – Machine Learning", body_style)]
    ]
    meta_table = Table(meta_data, colWidths=[270, 270])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#e2e8f0')),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # Executive Summary & Dataset Overview
    story.append(Paragraph("1. Executive Summary & Dataset Overview", h2_style))
    exec_text = (
        f"This report presents the quantitative risk and return analysis for an equal-weighted portfolio "
        f"comprising {portfolio_results.get('num_stocks', 0)} Indian NSE-listed stocks across multiple sectors. "
        f"The dataset contains <b>{quality_summary.get('valid_records', 0):,}</b> valid trading records spanning "
        f"from <b>{quality_summary.get('date_range', {}).get('start', 'N/A')}</b> to <b>{quality_summary.get('date_range', {}).get('end', 'N/A')}</b>."
    )
    story.append(Paragraph(exec_text, body_style))

    # Key Portfolio Results Summary Table
    story.append(Paragraph("2. Portfolio Risk & Diversification Metrics", h2_style))
    port_metrics_data = [
        ["Metric", "Value", "Description / Formula"],
        ["Equal-Weighted Portfolio Volatility", f"{portfolio_results.get('portfolio_volatility_pct', 0):.2f}%", "Annualized (σ_daily × √252)"],
        ["Average Individual Stock Volatility", f"{portfolio_results.get('avg_individual_volatility_pct', 0):.2f}%", "Mean annualized vol across constituent stocks"],
        ["Diversification Benefit (Risk Reduction)", f"{portfolio_results.get('diversification_benefit_pct', 0):.2f}%", "(1 - Port_Vol / Avg_Ind_Vol) × 100"],
        ["Portfolio 99% Parametric 1-Day VaR", f"{portfolio_results.get('portfolio_parametric_var_99_pct', 0):.2f}%", "2.326 × σ_p - μ_p (Parametric loss estimate)"],
        ["Portfolio Sharpe Ratio", f"{portfolio_results.get('portfolio_sharpe_ratio', 0):.3f}", "(Annualized Return - 5.25% Rf) / Port_Vol"]
    ]

    port_table = Table(port_metrics_data, colWidths=[180, 100, 260])
    port_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e293b')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f1f5f9')])
    ]))
    story.append(port_table)
    story.append(Spacer(1, 12))

    # Individual Stock Breakdown Table
    story.append(Paragraph("3. Stock-Level Risk Analysis Breakdown", h2_style))
    stock_rows = [["Stock", "Sector", "Ann. Vol (%)", "VaR 99% (%)", "Sharpe", "Beta", "Classification"]]
    
    for m in portfolio_results.get('individual_stock_metrics', [])[:17]:
        stock_rows.append([
            m.get('stock', ''),
            m.get('sector', ''),
            f"{m.get('annualized_volatility_pct', 0):.2f}%",
            f"{m.get('parametric_var_99_pct', 0):.2f}%",
            f"{m.get('sharpe_ratio', 0):.3f}",
            f"{m.get('beta', 0):.3f}",
            m.get('risk_classification', '')
        ])

    stock_table = Table(stock_rows, colWidths=[80, 80, 75, 75, 60, 50, 120])
    stock_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 8.5),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('PADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')])
    ]))
    story.append(stock_table)
    story.append(Spacer(1, 12))

    # Key Findings & Conclusion
    story.append(Paragraph("4. Key Findings & Observations", h2_style))
    highlights = portfolio_results.get('highlights', {})
    obs_text = (
        f"• <b>Highest Volatility Asset:</b> {highlights.get('highest_volatility', {}).get('stock', 'N/A')} "
        f"({highlights.get('highest_volatility', {}).get('value_pct', 0):.2f}% annualized volatility).<br/>"
        f"• <b>Lowest Volatility Asset:</b> {highlights.get('lowest_volatility', {}).get('stock', 'N/A')} "
        f"({highlights.get('lowest_volatility', {}).get('value_pct', 0):.2f}% annualized volatility).<br/>"
        f"• <b>Highest Risk-Adjusted Return (Sharpe):</b> {highlights.get('highest_sharpe', {}).get('stock', 'N/A')} "
        f"(Sharpe Ratio = {highlights.get('highest_sharpe', {}).get('value', 0):.3f}).<br/>"
        f"• <b>Highest Sensitivity (Beta):</b> {highlights.get('highest_beta', {}).get('stock', 'N/A')} "
        f"(Beta = {highlights.get('highest_beta', {}).get('value', 0):.3f}).<br/>"
        f"• <b>Diversification Effect:</b> The variance reduction achieved by matrix covariance weighting "
        f"lowered overall portfolio risk from <b>{portfolio_results.get('avg_individual_volatility_pct', 0):.2f}%</b> "
        f"down to <b>{portfolio_results.get('portfolio_volatility_pct', 0):.2f}%</b>."
    )
    story.append(Paragraph(obs_text, body_style))

    # Limitations & Future Work
    story.append(Paragraph("5. Limitations & Future Scope", h2_style))
    lim_text = (
        "• <b>Benchmark Note:</b> If NIFTY 50 data is omitted, Beta values are evaluated against an equal-weighted portfolio proxy.<br/>"
        "• <b>Normal Distribution Assumption:</b> Parametric VaR assumes Gaussian return distributions; extreme tail events may be better captured by Historical Simulation or Monte Carlo.<br/>"
        "• <b>Future Scope:</b> Implementation of Markowitz Mean-Variance Optimization, Maximum Sharpe frontiers, Machine Learning volatility forecasting (GARCH/LSTM), and real-time NSE API integration."
    )
    story.append(Paragraph(lim_text, body_style))

    # Disclaimer Footer
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cbd5e1'), spaceAfter=8))
    disclaimer_text = (
        "Educational project only. The analysis is based on historical data and statistical estimates and does not "
        "constitute financial or investment advice. Past performance does not guarantee future results. "
        "Developed for CS5403 Machine Learning Project Review."
    )
    story.append(Paragraph(disclaimer_text, disclaimer_style))

    doc.build(story)
    buffer.seek(0)
    return buffer
